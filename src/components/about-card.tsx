import Image from "next/image";

interface AboutCardProp {
  title: string;
  subTitle: string;
  description: string;
  image?: string;
}

export function AboutCard({ title, description, subTitle, image }: AboutCardProp) {
  return (
    <div className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl bg-gray-900 relative overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-50"
          />
        </div>
      )}
      <div className="relative z-10">
        <h6 className="mb-4 text-center text-lg font-semibold text-white">{subTitle}</h6>
        <h4 className="text-center text-2xl font-bold text-white">{title}</h4>
        <p className="mt-2 mb-10 text-base w-full lg:w-8/12 text-center font-normal text-white">{description}</p>
        <button className="px-4 py-2 rounded bg-white text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors">view details</button>
      </div>
    </div>
  );
}

export default AboutCard;
