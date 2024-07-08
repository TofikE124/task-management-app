interface Props {
  children: React.ReactNode;
}
const DropdownElements = ({ children }: Props) => {
  return (
    <div className="peer absolute w-full mt-2 py-4 rounded-lg overflow-hidden shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] bg-white translate-y-[-25px] invisible opacity-0 transition-all duration-[250ms] dark:bg-very-dark-grey group-toggled:visible group-toggled:opacity-100 group-toggled:translate-y-0">
      {children}
    </div>
  );
};

export default DropdownElements;
