"use client";

import { getStudentImage, test } from "@/lib/actions/server.action";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const loopRef = useRef(null); // interval id
  const startedRef = useRef(false);

  const [status, setStatus] = useState("Select section and start the camera.");
  const [detected, setDetected] = useState("System is idle...");
  const [faceapi, setFaceapi] = useState(null);
  const [section, setSection] = useState(""); // selected section
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api models once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const faceAPI = await import("face-api.js");
        if (!mounted) return;
        setFaceapi(faceAPI);

        setStatus("Loading face models…");
        await Promise.all([
          faceAPI.nets.tinyFaceDetector.loadFromUri("/models"),
          faceAPI.nets.faceLandmark68Net.loadFromUri("/models"),
          faceAPI.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        setStatus("Models loaded. Please select section and start camera.");
        setModelsLoaded(true);
      } catch (err) {
        console.error(err);
        setStatus("Error loading models: " + String(err));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const startCameraAndRecognition = async () => {
    if (!faceapi) return;
    if (!section) {
      setStatus("Please select a section first.");
      return;
    }

    try {
      setStatus("Starting camera…");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      await new Promise((res) => (videoRef.current.onloadedmetadata = res));
      videoRef.current.play();
      setStatus("Camera ready. Loading students…");

      // Fetch student images
      const labels = await getStudentImage(section);
      if (!labels.length) {
        setStatus("No students found for this section.");
        return;
      }

      setStatus(`Found ${labels.length} students. Preparing descriptors…`);

      const labeled = await Promise.all(
        labels.map(async (label) => {
          const desc = [];
          try {
            const img = await faceapi.fetchImage(
              `/labeled_images/${label}/1.jpg`
            );
            const det = await faceapi
              .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (det?.descriptor) desc.push(det.descriptor);
          } catch (_) {}
          if (!desc.length) return null;
          return new faceapi.LabeledFaceDescriptors(label, desc);
        })
      );

      const labeledDescriptors = labeled.filter(Boolean);
      if (!labeledDescriptors.length) {
        setStatus("No valid reference images found for students.");
        return;
      }

      const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

      const video = videoRef.current;
      const canvas = faceapi.createCanvasFromMedia(video);
      canvasWrapRef.current.innerHTML = "";
      canvasWrapRef.current.appendChild(canvas);
      const size = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, size);

      setStatus("Running detection… Look at the camera.");
      startedRef.current = true;

      // Detection loop
      loopRef.current = setInterval(async () => {
        try {
          const dets = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          const resized = faceapi.resizeResults(dets, size);
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (!resized.length) {
            setDetected("Unable to detect");
            return;
          }

          let anyName = "Unable to detect";
          resized.forEach((d) => {
            const confidence = (d.detection.score * 100).toFixed(1);
            const best = matcher.findBestMatch(d.descriptor);
            const name =
              best.label === "unknown" ? "Unable to detect" : best.label;
            if (name !== "Unable to detect") anyName = name;
            new faceapi.draw.DrawBox(d.detection.box, {
              label: `${name} ${confidence}%`,
            }).draw(canvas);
            console.log(name, section, confidence);

            test(name, section, confidence);
          });

          setDetected(anyName);
        } catch (e) {
          console.error(e);
        }
      }, 200);
    } catch (err) {
      console.error(err);
      setStatus("Error starting camera: " + String(err));
    }
  };

  const stopCamera = () => {
    // Stop interval
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = null;
    startedRef.current = false;

    // Stop video stream
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasWrapRef.current) canvasWrapRef.current.innerHTML = "";

    setDetected("System is idle...");
    setStatus("Camera stopped. You can start again.");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", textAlign: "center" }}>
      <h1>Face Recognition Attendance</h1>

      {/* Section selector */}
      <div style={{ margin: "12px 0" }}>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          style={{ padding: 6, fontSize: 16 }}
        >
          <option value="">Select Section</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: 12 }}>
        <Button
          onClick={startCameraAndRecognition}
          disabled={!modelsLoaded || startedRef.current}
          style={{ padding: "8px 16px", fontSize: 16, cursor: "pointer" }}
          className="bg-brand hover:bg-purple-500"
        >
          Start Camera
        </Button>
        <Button
          onClick={stopCamera}
          disabled={!startedRef.current}
          style={{
            padding: "8px 16px",
            fontSize: 16,
            marginLeft: 12,
            cursor: "pointer",
          }}
          className="bg-error hover:bg-rose-600"
        >
          Stop Camera
        </Button>
      </div>

      <p style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>{status}</p>

      <div
        style={{ position: "relative", display: "inline-block", marginTop: 12 }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: 720,
            height: "auto",
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        />
        <div
          ref={canvasWrapRef}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
      </div>

      <h2 style={{ marginTop: 16 }}>
        Detected: <span style={{ fontFamily: "monospace" }}>{detected}</span>
      </h2>
    </div>
  );
};

export default FaceRecognition;
