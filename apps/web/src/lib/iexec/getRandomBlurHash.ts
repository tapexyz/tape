// Generated from pictures at https://woltapp.github.io/react-blurhash/
const blurHashes = [
  'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  'U_DU0}Woaxofp3WVj?j[S9oza}ayWEofflfP',
  'U8DSUltU8^}p00%N.A9Y]$[m,BKQ~DI:wa-A',
  'UmGuUYXmoLkC_4ofoLj[AcnOWVf6E1RjWVay',
  'UwG08=xtR*j?~Vt6RjkBwIjYRkj[I:kCWCf6',
  'UpOUoc|tIpJC8z:k$eOrR5yDs.rqx[RjaKoe',
  'UGN@.g3C9v-n4Q05vOxs0iqc^0%K%0-6.6Xm',
  'UGQT4I?KAd${?FM~TMNI9EIoOao$%KajI@Rj',
  'UGN@.g3C9v-n4Q05vOxs0iqc^0%K%0-6.6Xm',
  'UXL|ilJCxZof}:R,ofjtNHxVM}odT1oJNGj[',
  'U4AnJB%N00Mb_Kt6Mxad05NL%1ngIUWExun~',
  'UgHM=Z~XM+o}?uw~R:R%NNIWM{WUR;WCt6af'
]

const getRandomBlurHash = () => {
  const randomIndex = Math.floor(Math.random() * blurHashes.length)
  return blurHashes[randomIndex]
}

export default getRandomBlurHash
