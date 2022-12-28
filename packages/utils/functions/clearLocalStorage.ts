const clearLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('lenstube.store')
  localStorage.clear()
}
export default clearLocalStorage
