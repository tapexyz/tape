export const getToastOptions = (theme: string | undefined) => ({
  className: '!border-2 !rounded-xl !px-4 !border-brand-500 overflow-hidden',
  duration: 4000,
  error: {
    className: '!border-2 !rounded-xl !px-4 !border-red-500 overflow-hidden',
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white'
    }
  },
  loading: {
    className: '!border-2 !rounded-xl !px-4 !border-yellow-500 overflow-hidden'
  },
  style: {
    background: theme === 'dark' ? '#393a3e' : '',
    color: theme === 'dark' ? '#fff' : ''
  },
  success: {
    className: '!border-2 !rounded-xl !px-4 !border-green-500 overflow-hidden',
    iconTheme: {
      primary: '#10B981',
      secondary: 'white'
    }
  }
})
