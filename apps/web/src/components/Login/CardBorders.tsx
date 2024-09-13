const CardBorders = () => {
  return (
    <>
      <div className="tape-border -left-[8.5px] -top-[8.5px] absolute h-4 w-4 rounded-full" />
      <div className="-left-[1px] -top-44 absolute h-44 w-[1px] bg-gradient-to-t from-[#00000020] to-transparent dark:from-[#ffffff20]" />
      <div className="-left-44 -top-[1px] absolute h-[1px] w-44 bg-gradient-to-l from-[#00000020] to-transparent dark:from-[#ffffff20]" />

      <div className="tape-border -right-[8.5px] -top-[8.5px] absolute h-4 w-4 rounded-full" />
      <div className="-bottom-44 -left-[1px] absolute h-44 w-[1px] bg-gradient-to-b from-[#00000020] to-transparent dark:from-[#ffffff20]" />
      <div className="-bottom-[1px] -left-44 absolute h-[1px] w-44 bg-gradient-to-l from-[#00000020] to-transparent dark:from-[#ffffff20]" />

      <div className="tape-border -bottom-[8.5px] -right-[8.5px] absolute h-4 w-4 rounded-full" />
      <div className="-bottom-44 -right-[1px] absolute h-44 w-[1px] bg-gradient-to-b from-[#00000020] to-transparent dark:from-[#ffffff20]" />
      <div className="-bottom-[1px] -right-44 absolute h-[1px] w-44 bg-gradient-to-r from-[#00000020] to-transparent dark:from-[#ffffff20]" />

      <div className="tape-border -bottom-[8.5px] -left-[8.5px] absolute h-4 w-4 rounded-full" />
      <div className="-right-[1px] -top-44 absolute h-44 w-[1px] bg-gradient-to-t from-[#00000020] to-transparent dark:from-[#ffffff20]" />
      <div className="-right-44 -top-[1px] absolute h-[1px] w-44 bg-gradient-to-r from-[#00000020] to-transparent dark:from-[#ffffff20]" />
    </>
  );
};

export default CardBorders;
