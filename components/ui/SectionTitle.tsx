type SectionTitleProps = {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
};

export function SectionTitle({
  title,
  subtitle,
  as: Tag = 'h1',
}: SectionTitleProps) {
  return (
    <div className="mb-10">
      <Tag className="font-serif text-4xl text-navy md:text-5xl">{title}</Tag>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-navy-light">{subtitle}</p>
      ) : null}
    </div>
  );
}
