"use client";

import styles from "./style.module.css";

type Props={
invitation:any;
};

export default function Footer({invitation}:Props){

return(

<footer className={styles.footer}>

<h2>
Terima Kasih
</h2>

<p>
Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
</p>

<h3>
{invitation?.groom_name || "Rizky"}

<span>&</span>

{invitation?.bride_name || "Nabila"}
</h3>

<p className={styles.copyright}>
© {new Date().getFullYear()} Vistiq Invitation
</p>

</footer>

);

}