type WelcomeHeaderProps = {
  title: string;
  subTitle: string;
};

export const WelcomeHeader = ({ title, subTitle }: WelcomeHeaderProps) => (
  <header className="flex w-[31.875rem] flex-col gap-4 text-black">
    <h1 className="text-center text-[2rem] font-semibold">
      <p>{title}</p>
    </h1>
    <h2 className="whitespace-pre-line text-center text-2xl font-normal leading-tight">
      <p>{subTitle}</p>
    </h2>
  </header>
);
