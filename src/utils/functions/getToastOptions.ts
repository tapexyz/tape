export const getToastOptions = (theme: string | undefined) => ({
  style: {
    background: theme === 'dark' ? '#1a1b1f' : '',
    color: theme === 'dark' ? '#fff' : '',
    padding: '3px 0px 3px 7px',
    borderRadius: '10px',
    border: '1px solid indigo'
  },
  success: {
    className: 'border !border-green-500 overflow-hidden',
    iconTheme: {
      primary: '#10B981',
      secondary: 'white'
    }
  },
  error: {
    className: 'border !border-red-500 overflow-hidden',
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white'
    }
  },
  loading: { className: 'border !border-yellow-700 overflow-hidden' }
})
