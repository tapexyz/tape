export const getToastOptions = (theme: string | undefined) => ({
  style: {
    background: theme === 'dark' ? '#1a1b1f' : '',
    color: theme === 'dark' ? '#fff' : ''
  },
  className: '!border-l-2 !rounded !border-indigo-500 overflow-hidden',
  success: {
    className: '!border-l-2 !rounded !border-green-500 overflow-hidden',
    iconTheme: {
      primary: '#10B981',
      secondary: 'white'
    }
  },
  error: {
    className: '!border-l-2 !rounded !border-red-500 overflow-hidden',
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white'
    }
  },
  loading: {
    className: '!border-l-2 !rounded !border-yellow-500 overflow-hidden'
  },
  duration: 3000
})
