
const CardBorders = () => {
  return (
    <>
      <div className="tape-border absolute -left-[8.5px] -top-[8.5px] h-4 w-4 rounded-full" />
      <div className="absolute -left-[1px] -top-44 h-44 w-[1px] bg-gradient-to-t from-[#18122D] to-transparent dark:from-[#18122D]" />
      <div className="absolute -left-44 -top-[1px] h-[1px] w-44 bg-gradient-to-l from-[#18122D] to-transparent dark:from-[#18122D]" />

      <div className="tape-border absolute -right-[8.5px] -top-[8.5px] h-4 w-4 rounded-full" />
      <div className="absolute -bottom-44 -left-[1px] h-44 w-[1px] bg-gradient-to-b from-[#18122D] to-transparent dark:from-[#18122D]" />
      <div className="absolute -bottom-[1px] -left-44 h-[1px] w-44 bg-gradient-to-l from-[#18122D] to-transparent dark:from-[#18122D]" />

      <div className="tape-border absolute -bottom-[8.5px] -right-[8.5px] h-4 w-4 rounded-full" />
      <div className="absolute -bottom-44 -right-[1px] h-44 w-[1px] bg-gradient-to-b from-[#18122D] to-transparent dark:from-[#18122D]" />
      <div className="absolute -bottom-[1px] -right-44 h-[1px] w-44 bg-gradient-to-r from-[#18122D] to-transparent dark:from-[#18122D]" />

      <div className="tape-border absolute -bottom-[8.5px] -left-[8.5px] h-4 w-4 rounded-full" />
      <div className="absolute -right-[1px] -top-44 h-44 w-[1px] bg-gradient-to-t from-[#18122D] to-transparent dark:from-[#18122D]" />
      <div className="absolute -right-44 -top-[1px] h-[1px] w-44 bg-gradient-to-r from-[#18122D] to-transparent dark:from-[#18122D]" />
    </>
  )
}

export default CardBorders
