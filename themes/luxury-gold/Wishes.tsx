"use client";

import styles from "./style.module.css";

type Props={
    invitation:any;
};

export default function Wishes({invitation}:Props){

return(

<section className={styles.wishes}>

<div className={styles.container}>

<p className={styles.sectionLabel}>
Wedding Wishes
</p>

<h2 className={styles.sectionTitle}>
Ucapan & Doa
</h2>

<div className={styles.wishesList}>

<div className={styles.wishCard}>
<strong>Andi</strong>
<p>Selamat menempuh hidup baru semoga menjadi keluarga sakinah mawaddah warahmah.</p>
</div>

<div className={styles.wishCard}>
<strong>Siti</strong>
<p>Barakallah, semoga selalu bahagia hingga akhir hayat.</p>
</div>

<div className={styles.wishCard}>
<strong>Ahmad</strong>
<p>Selamat berbahagia, semoga dilancarkan sampai hari H.</p>
</div>

</div>

</div>

</section>

);

}