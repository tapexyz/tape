export const Users = () => {
  return (
    <div className="grid grid-cols-2 gap-5 rounded-card bg-theme p-5">
      <div className="space-y-6">
        <h1 className="font-serif text-[28px] leading-[28px]">
          Trending creators <span className="text-primary/20">(4)</span>
        </h1>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-44 rounded-card bg-secondary">1</div>
          <div className="h-44 rounded-card bg-secondary">2</div>
          <div className="h-44 rounded-card bg-secondary">3</div>
          <div className="h-44 rounded-card bg-secondary">4</div>
        </div>
      </div>
      <div>
        <h1 className="font-serif text-[28px] leading-[28px]">
          Top collectors <span className="text-primary/20">(6)</span>
        </h1>
      </div>
    </div>
  );
};
