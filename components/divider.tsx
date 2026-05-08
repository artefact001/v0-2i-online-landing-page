export function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 px-6 md:px-[60px]">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[rgba(201,162,39,0.3)]" />
      <div className="w-2 h-2 bg-[#C9A227] rotate-45" />
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[rgba(201,162,39,0.3)]" />
    </div>
  )
}
