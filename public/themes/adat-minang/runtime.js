/* Vistiq data adapter. The saved visual layout has no reference backend code. */
(() => {
  'use strict';
  const channel = 'vistiq-minang-v1';
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => [...root.querySelectorAll(s)];
  const widget = id => q(`[data-id="${id}"]`);
  const text = (id, value) => {
    const el = widget(id); if (!el) return;
    const target = q('.elementor-heading-title', el) || q('.elementor-widget-container', el);
    if (target) target.textContent = value || '';
  };
  const image = (id, value) => {
    const el = widget(id); const img = el && q('img', el);
    if (!img) return;
    el.hidden = !value;
    if (value) { img.src = value; img.alt = ''; }
  };
  const safeUrl = value => {
    if (!value) return '';
    try { const u = new URL(value, location.origin); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
  };
  const link = (id, value, label) => {
    const el = widget(id); if (!el) return;
    const a = q('a', el); const url = safeUrl(value);
    el.hidden = !url;
    if (a && url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; if (label) { const span = q('.idb-social-label', a); if (span) span.textContent = label; else a.textContent = label; } }
  };
  const send = (type, payload) => parent.postMessage({ channel, type, ...payload }, location.origin);
  let invitation, opened = false, targetDate = null, attendance = 'Hadir';
  const cover = q('#sec');
  const music = new Audio(); music.loop = true; music.preload = 'none';
  // Remove reference audio controls; one local control follows the Vistiq track.
  qa('[data-id="271ccb48"]').forEach(el => el.remove());
  const musicButton = document.createElement('button');
  musicButton.className = 'vistiq-music'; musicButton.type = 'button'; musicButton.hidden = true;
  musicButton.setAttribute('aria-label', 'Putar musik'); musicButton.textContent = '♫';
  document.body.append(musicButton);
  musicButton.onclick = () => { if (music.paused) music.play().catch(() => {}); else music.pause(); };
  music.onplay = () => { musicButton.classList.add('playing'); musicButton.setAttribute('aria-label', 'Jeda musik'); };
  music.onpause = () => { musicButton.classList.remove('playing'); musicButton.setAttribute('aria-label', 'Putar musik'); };
  function reveal() {
    qa('.idb-reveal, .af, .reveal, .revealin, .revealkanan, .revealkiri, .revealatas, .revealr').forEach(el => {
      if (!opened && !cover.contains(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight - Number(el.dataset.revealOffset || 0) && rect.bottom > 0) {
        el.style.transitionDuration = `${Number(el.dataset.revealDuration || 2000)}ms`;
        el.style.transitionDelay = `${Number(el.dataset.revealDelay || 0)}ms`;
        el.classList.add('active');
      }
    });
  }
  function open() {
    if (opened) return; opened = true;
    q('#kolom').style.transform = 'translateY(-100%)'; q('#kolom').style.transition = 'transform 1.5s ease-in-out'; cover.style.transition = 'opacity 1.5s ease-in-out'; cover.style.opacity = '0'; cover.style.pointerEvents = 'none';
    setTimeout(() => { cover.hidden = true; }, 1500);
    qa('.aw').forEach(el => el.style.display = 'block');
    document.body.classList.add('vistiq-opened'); window.scrollTo(0, 0);
    if (invitation.musicUrl) { musicButton.hidden = false; music.play().catch(() => {}); }
    reveal(); [100,500,1500,2500,4000].forEach(delay => setTimeout(reveal,delay)); send('opened');
  }
  q('#open').addEventListener('click', open);
  const openLink = q('#open a'); openLink.href = '#'; openLink.addEventListener('click', e => e.preventDefault());
  const gallery = widget('376566b3');
  const galleryRoot = q('.elementor-widget-container', gallery);
  const lightbox = document.createElement('dialog'); lightbox.className = 'vistiq-lightbox';
  const close = document.createElement('button'); close.textContent = '×'; close.setAttribute('aria-label', 'Tutup foto');
  const fullImage = document.createElement('img'); fullImage.alt = 'Foto galeri'; lightbox.append(close, fullImage); document.body.append(lightbox);
  close.onclick = () => lightbox.close(); lightbox.onclick = e => { if (e.target === lightbox) lightbox.close(); };
  function hydrate(data, guest) {
    invitation = data;
    const names = `${data.groom.nickname || data.groom.name} & ${data.bride.nickname || data.bride.name}`;
    ['3a9b448a','69cc8d5b','212f0996'].forEach(id => text(id, names));
    text('7c38b67', guest || 'Tamu Undangan');
    text('192e221d', data.coverEvent?.date || data.events[0]?.date);
    text('37c57555', data.groom.name); text('5395fa0c', data.bride.name);
    text('7900dd3b', data.groom.parents); text('e0d14e8', data.bride.parents);
    image('72211be4', data.coverImage); image('592e2ca6', data.groom.photo); image('4c74ebe3', data.bride.photo);
    image('3625fbd0', data.storyPhotos?.[0] || data.gallery[0]);
    image('7ac1e7bb', data.coverImage); image('1fe084ff', data.coverImage);
    const ig = value => value ? (/^https?:/.test(value) ? value : `https://www.instagram.com/${value.replace(/^@/,'')}/`) : '';
    link('697f18ef', ig(data.groom.instagram)); link('6514b31', ig(data.bride.instagram));
    if (data.opening.greeting) text('207ccf72', data.opening.greeting);
    if (data.opening.description) text('75ea7fe4', data.opening.description);
    if (data.opening.title) text('6274a66a', data.opening.title);
    if (data.opening.quote) text('2f4a9127', data.opening.quote + (data.opening.quoteSource ? `\n(${data.opening.quoteSource})` : ''));
    if (data.closingGreeting) text('78d4bfd9', data.closingGreeting);
    text('2446fb72', `© ${new Date().getFullYear()} ${data.brand?.name || 'Vistiq Invitation'}`);
    // All personal photographs and gallery entries are Vistiq data, with no template fallback.
    if (data.backgroundPhoto || data.coverImage) q('#kolom').style.backgroundImage = `url(${JSON.stringify(safeUrl(data.backgroundPhoto || data.coverImage))})`;
    const stories = q('.idb-timeline__list'); stories.replaceChildren(); widget('7a004a6f').hidden = !data.story.length;
    data.story.forEach(item => {
      const el = document.createElement('div'); el.className = 'idb-timeline__item';
      const content = document.createElement('div'); content.className = 'idb-timeline__content idb-reveal idb-ef zoom-up';
      const title = document.createElement('h3'); title.className = 'idb-timeline__title'; title.textContent = item.title;
      const desc = document.createElement('div'); desc.className = 'idb-timeline__desc'; desc.textContent = item.description;
      content.append(title, desc); el.append(content); stories.append(el);
    });
    const eventTemplates = [widget('77c71717'),widget('499fffbd')];
    const eventParent = eventTemplates[0].parentElement;
    const eventIds = [['26cd54ff','16c01fcb','437c08a3','41474f7f','4e96e590'],['70a619f4','7dee56cc','1ea9031a','7d8fdd66','304ada1c']];
    data.events.forEach((event, index) => {
      const sourceIndex = Math.min(index, 1); let root = eventTemplates[sourceIndex];
      if (index > 1) { root = root.cloneNode(true); root.removeAttribute('data-id'); eventParent.append(root); }
      const ids = eventIds[sourceIndex];
      const set = (id, value) => { const el = root.querySelector(`[data-id="${id}"]`); const target = el && (q('.elementor-heading-title', el) || q('.elementor-widget-container', el)); if (target) target.textContent = value || ''; };
      set(ids[0], event.name); set(ids[1], event.date); set(ids[2], event.time ? `Pukul : ${event.time}` : ''); set(ids[3], event.location);
      const a = root.querySelector(`[data-id="${ids[4]}"] a`); const url = safeUrl(event.mapsUrl || data.mapsUrl);
      if (a) { a.href = url || '#'; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.closest('[data-widget_type]').hidden = !url; }
    });
    eventTemplates.forEach((el, i) => { el.hidden = !data.events[i]; });
    targetDate = data.coverEvent?.rawDate || data.events[0]?.rawDate;
    widget('4a6a1d31').hidden = !targetDate;
    widget('13229278').hidden = !data.liveStreamingUrl;
    text('2fedc292', data.coverEvent?.date || data.events[0]?.date); text('34c3b5ca', data.coverEvent?.time || data.events[0]?.time);
    link('6783a0da', data.liveStreamingUrl, 'Saksikan Live Streaming');
    widget('4611572b').hidden = !data.gifts.length;
    const giftRoot = q('.elementor-widget-container', widget('64e6510f')); const giftTemplate = q('.idb-copy-rek', giftRoot).cloneNode(true); giftRoot.replaceChildren();
    data.gifts.forEach(account => {
      const card = giftTemplate.cloneNode(true); card.removeAttribute('id'); card.classList.remove('elementor-invisible');
      q('.idb-copy-rek__numtext',card).textContent = account.accountNumber || ''; q('.idb-copy-rek__name',card).textContent = account.accountName || account.owner;
      const label = q('.idb-copy-rek__label',card); label.replaceChildren();
      if (account.bankName?.toUpperCase().replace(/\s/g,'') === 'BCA') { const logo = document.createElement('img'); logo.src = '/themes/adat-minang/BCA_5770.webp'; logo.alt = 'BCA'; logo.style.width = '65px'; logo.style.marginLeft = 'auto'; label.append(logo); }
      else { label.textContent = account.bankName || ''; }
      q('button',card).onclick = async () => { const toast = q('.idb-copy-rek__toast',card); try { await navigator.clipboard.writeText(account.accountNumber || ''); toast.textContent = 'Tersalin.'; } catch { toast.textContent = 'Silakan salin nomor rekening secara manual.'; } };
      giftRoot.append(card);
    });
    const giftToggle = q('#klik a'); if (giftToggle) { giftToggle.href = '#'; giftToggle.onclick = e => { e.preventDefault(); const el=q('#amplop'); el.style.display = el.style.display === 'none' ? 'flex' : 'none'; }; }
    q('#amplop').style.display = 'none';
    galleryRoot.replaceChildren(); galleryRoot.classList.add('vistiq-gallery');
    widget('2f30cbe6').hidden = !data.gallery.length && !data.videoUrl;
    data.gallery.forEach(url => {
      const button = document.createElement('button'); button.type='button'; button.setAttribute('aria-label','Buka foto galeri');
      const img = document.createElement('img'); img.src=url; img.loading='lazy'; img.alt='Foto galeri'; button.append(img);
      button.onclick = () => { fullImage.src=url; lightbox.showModal(); }; galleryRoot.append(button);
    });
    const videoRoot = q('.elementor-widget-container',widget('1acf5c24')); videoRoot.replaceChildren(); widget('1acf5c24').hidden=!data.videoUrl;
    if (data.videoUrl) {
      const url = safeUrl(data.videoUrl); const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      if (match) { const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${match[1]}`;frame.title='Video undangan';frame.allowFullscreen=true;videoRoot.append(frame); }
      else if (url) { const video=document.createElement('video');video.src=url;video.controls=true;video.preload='none';videoRoot.append(video); }
    }
    if (data.musicUrl) music.src=data.musicUrl;
    q('[data-rsvp="name"]').value=guest || '';
    q('[data-rsvp="send"]').disabled=false;
    document.body.style.visibility='visible'; reveal();
  }
  const sendButton = q('[data-rsvp="send"]');
  qa('[data-rsvp-pill]').forEach(button => button.onclick = () => {
    attendance=button.dataset.rsvpPill==='hadir'?'Hadir':'Tidak Hadir';
    qa('[data-rsvp-pill]').forEach(b => b.dataset.active=String(b===button?1:0));
  });
  q('[data-rsvp-pill="hadir"]').dataset.active='1';
  sendButton.onclick=() => {
    const name=q('[data-rsvp="name"]').value.trim(); const message=q('[data-rsvp="message"]').value.trim(); const live=q('.rsvp-live');
    if (!name || !message) { live.textContent='Nama dan ucapan wajib diisi.'; return; }
    sendButton.disabled=true;sendButton.textContent='Mengirim...'; send('submit',{input:{name,message,whatsapp:'',attendance}});
  };
  function wishes(state) {
    q('[data-rsvp-stat="hadir"]').textContent=state.counts.hadir; q('[data-rsvp-stat="tidak"]').textContent=state.counts.tidakHadir;
    const list=q('.rsvp-list');list.replaceChildren();
    state.entries.forEach(entry => { const li=document.createElement('li');li.className='rsvp-item';const name=document.createElement('strong');name.textContent=entry.name;const status=document.createElement('span');status.textContent=` · ${entry.attendance}`;const msg=document.createElement('p');msg.textContent=entry.message;li.append(name,status,msg);list.append(li); });
    let more=q('.vistiq-more');if(!more){more=document.createElement('button');more.className='vistiq-more rsvp-send';more.textContent='Muat lebih banyak';more.onclick=()=>send('loadMore');q('.rsvp-comments-wrap').append(more);}more.hidden=!state.hasMore;
  }
  window.addEventListener('message', event => {
    if(event.source!==parent || event.origin!==location.origin || event.data?.channel!==channel)return;
    const m=event.data;
    if(m.type==='init' && !invitation)hydrate(m.invitation,m.guest);
    else if(m.type==='wishes')wishes(m.state);
    else if(m.type==='result'){sendButton.disabled=false;sendButton.textContent='Kirim';q('.rsvp-live').textContent=m.error || 'Terima kasih, ucapan Anda sudah terkirim.';if(!m.error)q('[data-rsvp="message"]').value='';}
  });
  const vh=()=>document.documentElement.style.setProperty('--vh',`${innerHeight*.01}px`);vh();window.addEventListener('resize',vh);window.addEventListener('scroll',reveal,{passive:true});
  setInterval(()=>{
    if(!targetDate)return;const seconds=Math.max(0,Math.floor((new Date(targetDate).getTime()-Date.now())/1000));if(!Number.isFinite(seconds))return;
    const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
    qa('.idb-countdown__number, .idb-countdown__num, [data-days], [data-hours], [data-minutes], [data-seconds]').forEach((el,i)=>{if(i<4)el.textContent=String(values[i]).padStart(2,'0');});
  },1000);
  send('ready');
})();
