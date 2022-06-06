export const dataURLtoFile = async (dataURI: string, fileName: string) => {
  const blob = await fetch(dataURI).then((r) => r.blob())
  const file = new File([blob], fileName)
  return file
}
