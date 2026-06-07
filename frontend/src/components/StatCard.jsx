function StatCard({
  title,
  value,
  color
}) {

  return (

    <div className="card">

      <div className="card-content">

        <h3 className="card-title">
          {title}
        </h3>

        <h1
          className={`card-value ${color}`}
        >
          {value}
        </h1>

      </div>

    </div>

  );
}

export default StatCard;