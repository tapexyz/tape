export const getToastOptions = (theme: string | undefined) => ({
  style: {
    background: theme === 'dark' ? '#393a3e' : '',
    color: theme === 'dark' ? '#fff' : ''
  },
  className: '!border-2 !rounded-full !px-4 !border-indigo-500 overflow-hidden',
  success: {
    className:
      '!border-2 !rounded-full !px-4 !border-green-500 overflow-hidden',
    iconTheme: {
      primary: '#10B981',
      secondary: 'white'
    }
  },
  error: {
    className: '!border-2 !rounded-full !px-4 !border-red-500 overflow-hidden',
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white'
    }
  },
  loading: {
    className:
      '!border-2 !rounded-full !px-4 !border-yellow-500 overflow-hidden'
  },
  duration: 4000
})
