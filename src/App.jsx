import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import './App.css';
import Model from './modelview';
import Typed from 'typed.js';
import { ScaleLoader } from "react-spinners"; // Import ScaleLoader


const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);

    controls.current.target.set(0, 0, 0); // x, y, z coordinates of the new pivot point


    controls.current.minPolarAngle = Math.PI / 3;
    controls.current.maxPolarAngle = Math.PI / 1.5;
    controls.current.minDistance = 5;
    controls.current.maxDistance = 15;
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;
    controls.current.maxAzimuthAngle = Math.PI / 10;
    controls.current.minAzimuthAngle = -Math.PI / 10;
    controls.current.enableZoom = false;

    return () => controls.current.dispose();
  }, [camera, gl]);

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);  // Default to true, so loading screen shows initially
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [experienceVisible, setExperienceVisible] = useState(false);
  const typedElement = useRef(null);
  const glowRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);  // Simulate model loading completion
    }, 8000); // 8 seconds or adjust to model loading time
  }, []);

  useEffect(() => {
    if (!loading) {  // Only start the typewriter after loading is done
      const typed = new Typed(typedElement.current, {
        strings: ["Hello, I'm Nitya."],
        typeSpeed: 70,
        backSpeed: 150,
        loop: false,
        showCursor: true,
        cursorChar: "| ",
        backDelay: 1000,
      });

      return () => typed.destroy();
    }
  }, [loading]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const glow = glowRef.current;
      if (glow) {
        glow.style.left = `${event.clientX - 250}px`;
        glow.style.top = `${event.clientY - 250}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById("projects-section");
      if (projectsSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > projectsSection.offsetTop + 100) {
          setProjectsVisible(true);
        }
      }

      const experienceSection = document.getElementById("experience-section");
      if (experienceSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > experienceSection.offsetTop + 100) {
          setExperienceVisible(true);
        }
      }

      const connectSection = document.getElementById("connect-section");
      if (connectSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > connectSection.offsetTop + 100) {
          setExperienceVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProjectClick = (project) => {
    setPopupContent(project);
    setPopupVisible(true);
  };

  

  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent('');
  };

  return (
    <div className="App">
      <div className="glow-effect" ref={glowRef}></div>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            {popupContent && (
              <>
                <h2>{popupContent.title}</h2>
                <p>{popupContent.description}</p>
                {popupContent.image && (
                  <img src={popupContent.image} alt={popupContent.title} className="popup-image" />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (  // Show ScaleLoader if loading is true
        <div className="loading-screen">
          <ScaleLoader color="#ffffff" loading={loading} size={1000} />  {/* Custom loader */}
        </div>
      ) : (
        <header className="App-header share-tech-regular ">
          <h1><span ref={typedElement} className="auto-type"></span></h1>
          <p className="subheading roboto-mono-font">Welcome to my website.</p>
          <p className="description">
            I'm a Computer Engineering student at the University of Waterloo. I have an interest in frontend development, 
            cloud computing, and embedded systems. Explore my projects and experience below!
          </p>
        </header>
      )}

      <div className="Canvas-container">
        <Canvas
          style={{ width: "100%", height: "100vh", overflow: "visible" }}

          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <hemisphereLight intensity={0.8} color={0xffffff} groundColor={0x888888} />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          <CameraControls />
          <Model />
        </Canvas>
      </div>
    {/* Projects Section */}
    <div id="projects-section" className={`projects-section ${projectsVisible ? "visible" : ""}`}>
        <h2 className="projects-title">Projects</h2>
        <div className="projects-container">

        <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      AgriVision 🌎
    </div>
  ),
  description: (
    <div style={{
      fontSize: "0.8rem",
      color: "white",
      marginTop: "30px",
      marginLeft: "-50px",
      fontFamily: `"Roboto Mono", "monospace"`,
      textAlign: "left",
      width: "420px"
    }}>
      <img src="AgriVision.png" alt="AgriVision Project" style={{ width: "100%", height: "auto", marginBottom: "20px" }} />
      
      Engineered a full-stack AI-powered agricultural assistant, integrating YOLOv8-based plant disease detection and a GPT-powered Langchain chatbot to significantly reduce the risk of crop loss.
      Also designed a smart irrigation system using Arduino, soil moisture sensor, a Mini Water Pump, and an ESP32 module; automated water delivery based on soil data.
      
      <div style={{
        width: "1px",
        height: "550px",
        backgroundColor: "rgba(39, 31, 55, 1)",
        marginLeft: "450px",
        marginTop: "-463.5px"
      }}></div>
    </div>
  ),

  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left",
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="AgriVision.png"
          alt="AgriVision Project"
          style={{ width: "120%", height: "auto", marginBottom: "20px" }}
        />
        Engineered a full-stack AI-powered agricultural assistant, integrating YOLOv8-based plant disease detection and a GPT-powered Langchain chatbot to significantly reduce the risk of crop loss.
        Also designed a smart irrigation system using Arduino, soil moisture sensor, a Mini Water Pump, and an ESP32 module; automated water delivery based on soil data.
     
     </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
     {/* RIGHT SIDE CONTENT */}
<div style={{ width: "350px" , marginTop: "-40px"}}>
  <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
    Key Features:
  </h4>
  <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
    <li>YOLOv8 plant disease detection</li>
    <li>Langchain-powered chatbot</li>
    <li>Smart irrigation with ESP32</li>
    <li>Soil-based automation</li>
  </ul>

  {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>YOLOv8, OpenCV</li>
        <li>Langchain, GPT 3.5 Turbo</li>
        <li>Streamlit, Vercel</li>
        <li>Arduino IDE, ESP32, Soil Sensor</li>
      </ul>

  {/* Links */}
<div
  style={{
    marginTop: "20px",
    marginLeft: "60px",
    display: "flex",
    gap: "30px", // consistent spacing
    alignItems: "center"
  }}
>
  <a
    href="https://github.com/selvxhini-10/AI-Sustainability-App"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#FFFFFF",
      textDecoration: "none",
      fontSize: "1.3rem"
    }}
  >
    <i className="fab fa-github"></i>
  </a>
  
  <a
    href="https://devpost.com/software/agrivision-204umz"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#FFFFFF",
      textDecoration: "none",
      fontSize: "1.3rem"
    }}
  >
    <i className="fab fa-dev"></i>
  </a>
  
  <a
    href="https://ai-sustainability-app.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#FFFFFF",
      textDecoration: "none",
      fontSize: "1.3rem"
    }}
  >
    <i className="fas fa-mobile-alt"></i>
  </a>
</div>


</div>

    </div>
  )
  

})}>
  <img src="AgriVision.png" alt="AgriVision" className="project-image" />
  <div className="project-text">AgriVision 🌎</div>
  <div className="project-description-text">YOLOv8 ・ NumPy ・ React.js ・ Arduino ・ Python </div>
</div>

<div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match second example
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      Sentiment Analysis 📝
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="Sentiment1.png"
          alt="Sentiment Analysis"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        This project is an ML model using Scikit-Learn & Pickle that classifies product reviews to be either positive or negative with an 85% accuracy. Through this project, I learnt
        about training/testing data and loading CSV data files. I also learned about TF-IDF vectorization, which essentially
        converts the textual data into numerical values based on how frequently a specific word appears. I created a basic GUI
        on Streamlit which prompts users to enter a review.
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{width: "350px" , marginTop: "-40px"}}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "10px", color: "white", lineHeight: "1.6", marginLeft: "30px" }}>
          <li>Scikit-learn sentiment classifier</li>
          <li>TF-IDF vectorization</li>
          <li>Streamlit user interface</li>
          <li>Pickle model storage</li>
        </ul>

         {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>Scikit-Learn</li>
        <li>Streamlit</li>
        <li>Python</li>
        <li>Pickle</li>
      </ul>
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
          <a
            href="https://github.com/nityas24/Sentiment-Analysis-Model"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </div>
  )
  
})}>

            <img src="Sentiment1.png" alt="Sentiment Analysis" className="project-image" />
            <div className="project-text">Sentiment Analysis 📝</div>
            <div className="project-description-text">Scikit-Learn ・ Streamlit ・ Python ・ Pickle</div>
          </div>

         <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match the previous structure
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      Personal Portfolio 🎨
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="Portfolio.png"
          alt="Personal Portfolio"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        A React-based portfolio built with Three.js and Blender for an interactive 3D model experience.
        I integrated orbit controls, loading states, and scroll-based animations to create a dynamic user experience.
        The model was designed in Blender and rendered in real-time using <code>@react-three/fiber</code>.
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{width: "350px" , marginTop: "-40px"}}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "18px" }}>
          <li>Interactive 3D model with Blender + Three.js</li>
          <li>React + Tailwind frontend</li>
          <li>Orbit controls and real-time rendering</li>
          <li>Scroll-triggered animations</li>
        </ul>

        {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>React.js</li>
        <li>Three.js</li>
        <li>Blender</li>
        <li>HTML/CSS/Javascript</li>
      </ul>
  
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
          <a
            href="https://github.com/nityas24/Personal-Website"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://3d-portfolio.vercel.app/" //actual deployed app
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fas fa-mobile-alt"></i>
          </a>
        </div>
      </div>
    </div>
  )
  
})}>

            <img src="Portfolio.png" alt="Personal Portfolio" className="project-image" />
            <div className="project-text">Personal Portfolio 🎨</div>
            <div className="project-description-text">React・ Blender ・ Three.js ・ HTML/CSS </div>
          </div>

          <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match previous structure
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      Route Optimizer 📍
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="firstrespond.png"
          alt="Route Optimizer"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        A backend service built using Flask and hosted on Google Cloud to optimize first responder routes.
        This project optimizes emergency dispatch by using BigQuery to process incoming calls and assign them to the 
        closest available responders based on location and availability. Integrated with Google APIs, 
        it minimizes the need for manual communication between dispatchers and first responders, reducing 
        delays and improving response times. Project created during GeeseHacks 2025.
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{ width: "350px" , marginTop: "-40px" }}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "10px", color: "white", lineHeight: "1.6", marginLeft: "27px" }}>
          <li>Flask backend hosted on GCP</li>
          <li>BigQuery integration for call data</li>
          <li>Google Maps APIs for real-time routing</li>
        </ul>

        {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>Python</li>
        <li>BigQuery</li>
        <li>Flask</li>
        <li>Google Cloud</li>
      </ul>
  
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
          <a
            href="https://github.com/ManushPatell/Geesehacks"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-github"></i>
          </a>
  
          <a
            href="https://devpost.com/software/route-optimizer-for-first-responders"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-dev"></i>
          </a>
        </div>
      </div>
    </div>
  )
  
})}>
            <img src="firstrespond.png" alt="Route Optimizer" className="project-image" />
            <div className="project-text">Route Optimizer 📍</div>
            <div className="project-description-text">Python・ BigQuery ・ Flask ・ Google Cloud </div>
          </div>

          <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match previous structure
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      STM32 Project 💧
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="STM1.png"
          alt="STM32 Project"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        Built a real-time embedded system using STM32 and CubeIDE to monitor and alert hot tub users when water temperature exceeded safety thresholds.
        Involved reading from temperature sensors and sending alerts to an LCD display.  
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{width: "350px" , marginTop: "-40px" }}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
          <li>Real-time temperature monitoring</li>
          <li>STM32 with CubeIDE</li>
          <li>LCD display alert system</li>
          <li>Threshold-based warning logic</li>
        </ul>

        {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>STM-32</li>
        <li>CubeIDE</li>
        <li>Project Management</li>
        <li>Temperature Sensor</li>
      </ul>
  
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
          <a
            href="https://github.com/nityas24/STM32_1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-github"></i>
          </a>
  
        </div>
      </div>
    </div>
  )
  
})}>
            <img src="STM.jpg" alt="STM32 Project" className="project-image" />
            <div className="project-text">STM32 Project 💧</div>
            <div className="project-description-text">STM32・ CubeIDE ・ Project Management </div>
          </div>

          <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match previous structure
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      Garden Gaze 🌱
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "500px", marginLeft: "-50px" }}>
        <img
          src="garden.png"
          alt="Garden Gaze"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        A plant health detector app using Streamlit and the Plant.id API. Users upload plant images and receive real-time health insights
        along with care suggestions tailored to the plant species. Combines frontend responsiveness with backend API integration,
        making plant care more accessible and informed.
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{ width: "350px" , marginTop: "-40px" }}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
          <li>Plant.id API integration</li>
          <li>Image upload + health detection</li>
          <li>Streamlit frontend</li>
          <li>Care recommendations</li>
        </ul>

        {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>Streanlit</li>
        <li>Python</li>
        <li>Plant.id API</li>
        <li>HTML/CSS</li>
      </ul>
  
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
  
          <a
            href="https://devpost.com/software/garden-gaze"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1.3rem"
            }}
          >
            <i className="fab fa-dev"></i>
          </a>
        </div>
      </div>
    </div>
  )
  
})}>
            <img src="garden.png" alt="Garden Gaze" className="project-image" />
            <div className="project-text">Garden Gaze 🌱</div>
            <div className="project-description-text">Streamlit・ Python ・ APIs ・ HTML/CSS  </div>
          </div>



          <div className="project-box" onClick={() => handleProjectClick({
  title: (
    <div style={{
      textAlign: "left",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "white",
      marginTop: "-80px",  // Adjusted marginTop to match previous structure
      fontFamily: `"Roboto Mono", "monospace"`,
      marginLeft: "-50px"
    }}>
      Synthesizer 🎹
    </div>
  ),
  description: (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontSize: "0.8rem",
        color: "white",
        marginTop: "30px",
        fontFamily: `"Roboto Mono", "monospace"`,
        textAlign: "left"
      }}
    >
      {/* LEFT SIDE CONTENT */}
      <div style={{ width: "520px", marginLeft: "-50px" }}>
        <img
          src="Synth1.png"
          alt="MIDI Synthesizer Project"
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />
        Implemented potentiometers with a MIDI keyboard to create a fully customizable synthesizer. The interface allowed users
        to adjust volume, pitch, waveforms (square, sawtooth, etc.), musical intervals (like octaves and major fifths),
        and ADSR (attack, decay, sustain, release) envelope settings. 
        Built using Arduino IDE, Pure Data, and a Teensy Microcontroller as part of a Grade 12 Computer Engineering class project.
      </div>
  
      {/* VERTICAL LINE */}
      <div
        style={{
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(39, 31, 55, 1)",
          margin: "0 30px"
        }}
      ></div>
  
      {/* RIGHT SIDE CONTENT */}
      <div style={{width: "350px" , marginTop: "-40px"}}>
        <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "10px", marginLeft: "50px" }}>
          Key Features:
        </h4>
        <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
          <li>Waveform modulation</li>
          <li>ADSR envelope control</li>
          <li>Volume & pitch tuning</li>
          <li>Teensy + Pure Data integration</li>
        </ul>

        {/* Tech Stack */}
  <h4 style={{ color: "white", fontSize: "1rem", marginTop: "20px", marginBottom: "10px", marginLeft: "50px" }}>
        Tech Stack:
      </h4>
      <ul style={{ paddingLeft: "20px", color: "white", lineHeight: "1.6", marginLeft: "20px" }}>
        <li>MIDI</li>
        <li>Arduino</li>
        <li>Pure Data</li>
        <li>Teensy MC</li>
      </ul>
  
  
        {/* Links */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "60px",
            display: "flex",
            gap: "30px",
            alignItems: "center"
          }}
        >
         
        </div>
      </div>
    </div>
  )
  
})}>
            <img src="Synth1.png" alt="Synth" className="project-image" />
            <div className="project-text">Synthesizer 🎹</div>
            <div className="project-description-text">MIDI ・ Arduino ・ Pure Data ・ Teensy MC  </div>
          </div>

    
        </div>
      </div> 
{/* Experience Section */}
<div id="experience-section" className={`experience-title ${experienceVisible ? "visible" : ""}`}>
  Experience
  <div className="experience-container">
    {/* Microsoft WEA Experience */}
    <div className="experience-box">
  <img 
    src="thingy(2).png" 
    alt="UW Logo" 
    className="experience-image" 
    style={{ width: "100px", height: "auto", borderRadius: "10px", marginTop: "-50px" }} 
  />
  <div className="experience-text">
    <h2 style={{ fontSize: "27px", fontWeight: "bold" }}>Microsoft WEA: Azure & Cloud</h2>

    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      University of Waterloo
    </p>
    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      Jan 2025 - Present
    </p>
  </div>


<div className="experience-sub-text">
    <ul className="subheading roboto-mono-font" style={{ fontSize: "13px", fontWeight: "normal", lineHeight: "2.5", width:"600px", marginLeft: "-80px" }}>
      <li>Designed and built an end-to-end healthcare solution for Avanade using Microsoft Azure and AI services,
      contributing to both development and final presentation as part of a cross-functional team of 5 members</li>
      <li>Streamlined front-end functionality by integrating an AI model via Power Apps and Power Automate, improving
      workflow efficiency and user experience</li>
      <li>Achieved AI-900 and AZ-900 certifications, showcasing an understanding of cloud computing concepts with
      artificial intelligence principles, with scores of 930+ on both exams</li>
   </ul>
</div>

</div>



 {/* Swim Experience */}
 <div className="experience-box">
  <img 
    src="logo(1).png" 
    alt="UW Logo" 
    className="experience-image" 
    style={{ width: "100px", height: "auto", borderRadius: "10px", marginTop: "-50px" }} 
  />
  <div className="experience-text">
    <h2 style={{ fontSize: "27px", fontWeight: "bold" }}>Aquatics Instructor</h2>

    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      City of Brampton
    </p>
    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      Sept 2024 - Jan 2025
    </p>
  </div>

<div className="experience-sub-text">
<ul className="subheading roboto-mono-font" style={{ fontSize: "13px", fontWeight: "normal", lineHeight: "2.5", width:"600px", marginLeft: "-80px"}}>
<li> Instructed 150+ students, created lesson plans tailored to different skill levels and ages</li>
      <li> Taught proper form while offering constructive feedback for improvement of students, 85% pass rate</li>
     <li> Ensured adherence to top safety standards in aquatic instruction through ongoing first aid certification renewal</li>
   </ul>
</div>

</div>
</div>
</div> 


      {/*Connect Section */}
      <div id="connect-section" className={`connect-title ${experienceVisible ? "visible" : ""}`}>
        Connect with Me

        <p className="subheading roboto-mono-font" style={{ fontSize: "16px", fontWeight: "normal", lineHeight: "2.5" }}>
    Interested in working on a project together, or just want to say hi?  
    Drop me an email or connect with me on LinkedIn!
      </p>

        <div className="connect-container">
          <div className="connect-box" onClick={() => window.open('mailto:n53sharm@uwaterloo.ca', '_blank')}>
          <i className="fas fa-envelope" style={{ fontSize: '20px', marginRight: '8px' }}></i> Email
          </div>
          <div className="connect-box" onClick={() => window.open('https://www.linkedin.com/in/nitya-sharma24/', '_blank')}>
            <i className="fab fa-linkedin" style={{ fontSize: '20px', marginRight: '8px' }}></i> LinkedIn
          </div>
          <div className="connect-box" onClick={() => window.open('https://github.com/nityas24', '_blank')}>
            <i className="fab fa-github" style={{ fontSize: '20px', marginRight: '8px' }}></i> GitHub
          </div>
        </div>
      </div>


{/* New Footer Section */}
<div className="footer">

  <p className="copyright">© 2025 Nitya Sharma. All rights reserved.</p>
</div>



      <nav className="navbar">
      <button onClick={() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}}>
  About Me
</button>

        <button onClick={() => {
          const projectsSection = document.getElementById("projects-section");
          if (projectsSection) {
            const offset = projectsSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
       
        }}>Projects</button>

        <button onClick={() => {
          const experienceSection = document.getElementById("experience-section");
          if (experienceSection) {
            const offset = experienceSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>Experience</button>

        <button onClick={() => {
          const connectSection = document.getElementById("connect-section");
          if (connectSection) {
            const offset = connectSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>Connect</button>
      </nav>
    </div>
  );
}

export default App;