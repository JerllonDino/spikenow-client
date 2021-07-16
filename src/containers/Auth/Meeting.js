import { useState, useEffect, createRef, useRef, useContext } from "react";
import Peer from "peerjs";
import socket from "../../socket";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import dotenv from "dotenv";

dotenv.config();

socket.connect();

const peer = new Peer(undefined, {
  host: process.env.REACT_APP_BASEURL,
  port: process.env.REACT_APP_BASEPORT,
  path: "/",
});

const Media = ({ isMuted, stream, isVideo, name }) => {
  console.log("is?", isVideo);
  const mediaRef = createRef();
  useEffect(() => {
    mediaRef.current.srcObject = stream;
    console.log("video stream");
  }, [stream]);

  return (
    <>
      {isVideo ? (
        <video
          style={{ width: "50%", objectFit: "cover" }}
          ref={mediaRef}
          autoPlay
          muted={isMuted}
        />
      ) : (
        <div
          style={{
            width: "50%",
            objectFit: "cover",
            backgroundColor: "#2c2f33",
          }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div
            className="card rounded-circle d-flex justify-content-center align-items-center h1 bg-secondary mb-3 text-light"
            style={{ width: "100px", height: "100px" }}
          >
            {name.charAt(0)}
          </div>
          <h4 className="text-light">{name}</h4>
          <audio ref={mediaRef} autoPlay muted={isMuted} />
        </div>
      )}
    </>
  );
};

const Meeting = ({ match }) => {
  const { userInfo } = useContext(AuthorizedUserContext);
  const { full_name } = userInfo;
  const roomID = match.params.roomID;
  const isVideo = parseInt(match.params.isVideo);
  const [videos, setVideos] = useState([]);
  const [peers, setPeers] = useState([]);
  const [myVideo, setMyVideo] = useState([]);
  const [receiverName, setReceiverName] = useState([]);
  const myStreamRef = useRef();

  useEffect(() => {
    let mediaType = {
      video: true,
      audio: true,
    };
    if (!isVideo) {
      mediaType = {
        audio: true,
      };
    }

    navigator.mediaDevices.getUserMedia(mediaType).then((stream) => {
      setMyVideo({ stream, isMuted: true });
      myStreamRef.current = stream;
    });
    peer.on("call", (call) => {
      console.log("call", myStreamRef.current);

      call.answer(myStreamRef.current);
      setReceiverName(call.metadata.receiverName);
      call.on("stream", (userVideoStream) => {
        console.log("from on call");
        setVideos([...videos, { stream: userVideoStream, isMuted: false }]);
      });
      call.on("close", () => {
        console.log("close");
        setVideos([]);
      });
    });
    socket.on("user-disconnected", (userId) => {
      console.log(peers);
      const peer = peers.find((data) => data.userId === userId);
      console.log(peer);
      setVideos([]);
    });
    socket.on("user-connected", (userId, name) => {
      console.log("userconn", myStreamRef.current);

      connectToNewUser(userId, myStreamRef.current, name);
    });
    peer.on("open", (id) => {
      socket.emit("join-room", roomID, id, full_name);
      console.log("open", roomID);
    });
    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("join-room");
    };
  }, []);

  function connectToNewUser(userId, stream, name) {
    console.log("conn func", userId);
    const call = peer.call(userId, stream, {
      metadata: { receiverName: name },
    });

    call.on("stream", (userVideoStream) => {
      console.log("from conn", userVideoStream);
      setReceiverName(call.metadata.receiverName);
      setVideos([...videos, { stream: userVideoStream, isMuted: false }]);
    });
    call.on("close", () => {
      console.log("close");
      setVideos([]);
    });

    const arrayPeer = {
      userId: userId,
      call,
    };
    setPeers([...peers, arrayPeer]);
    console.log("peers", peers);
  }
  console.log("are videos", videos);
  console.log("peers out", peers);

  return (
    <>
      <div
        className="d-flex"
        style={{ backgroundColor: "#23272a", width: "100%", height: "100vh" }}
      >
        <Media
          isMuted={myVideo.isMuted}
          stream={myVideo.stream}
          isVideo={isVideo}
          name={full_name}
        />
        {videos.map(({ isMuted, stream }, index) => (
          <Media
            isMuted={isMuted}
            stream={stream}
            key={index}
            isVideo={isVideo}
            name={receiverName}
          />
        ))}
      </div>
    </>
  );
};

export default Meeting;
