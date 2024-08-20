interface BannerImageProps {
  imageUrl: string;
}

export const BannerImage = ({ imageUrl }: BannerImageProps) => {
  return (
    <div
      style={{
        height: '41vh',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    ></div>
  );
};
