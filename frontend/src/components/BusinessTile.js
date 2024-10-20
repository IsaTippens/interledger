const BusinessTile = ({ business }) => {
  return (
    <div className="business-tile">
      <h2>{business.name}</h2>
      <p>{business.address}</p>
      <p>Category: {business.category}</p>
    </div>
  );
};

export default BusinessTile;

