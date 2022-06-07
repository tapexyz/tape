export const getToastOptions = (theme: string | undefined) => ({
  style: {
    background: theme === 'dark' ? '#1a1b1f' : '',
    color: theme === 'dark' ? '#fff' : '',
    padding: '3px 0px 3px 7px',
    borderRadius: '10px'
  },
  success: {
    className: 'border border-indigo-500',
    iconTheme: {
      primary: '#10B981',
      secondary: 'white'
    }
  },
  error: {
    className: 'border border-red-500',
    iconTheme: {
      primary: '#EF4444',
      secondary: 'white'
    }
  },
  loading: { className: 'border border-yellow-700' }
})
