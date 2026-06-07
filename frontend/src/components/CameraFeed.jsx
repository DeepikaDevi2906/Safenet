function CameraFeed() {

  return (

    <div className="camera-container">

      <div className="camera-header">

        <h1 className="camera-title">
          Live Surveillance
        </h1>

        <div className="live-badge">
          LIVE
        </div>

      </div>

      <div className="camera-feed">

        <img
          src="http://127.0.0.1:5000/video-feed"
          alt="camera feed"
        />

      </div>

    </div>
  )
}

export default CameraFeed