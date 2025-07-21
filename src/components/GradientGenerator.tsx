import { Button } from "@swc-react/button";
import { Slider } from "@swc-react/slider";
import React, { useContext, useState, useEffect, useRef } from "react";
import { AddOnSdkContext } from "./App";
import { PRESET_GRADIENTS } from "../constants";
import { generateRandomGradient, hexToRgb } from "../utils/gradientUtils";
import "./GradientGenerator.css";

const GradientGenerator = () => {
  const addOnSdk = useContext(AddOnSdkContext);
  const [currentGradient, setCurrentGradient] = useState(PRESET_GRADIENTS[0]);
  const [angle, setAngle] = useState(45);
  const [customColor1, setCustomColor1] = useState("#ff6b6b");
  const [customColor2, setCustomColor2] = useState("#4ecdc4");
  const canvasRef = useRef(null);

  useEffect(() => {
    generateGradientImage();
  }, [currentGradient, angle]);

  const generateGradientImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Calculate gradient direction based on angle
    const radians = (angle * Math.PI) / 180;
    const x1 = Math.cos(radians) * width;
    const y1 = Math.sin(radians) * height;

    const gradient = ctx.createLinearGradient(0, 0, x1, y1);
    gradient.addColorStop(0, currentGradient.color1);
    gradient.addColorStop(1, currentGradient.color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const handlePresetClick = (preset) => {
    setCurrentGradient(preset);
    setAngle(preset.angle || 45);
  };

  const handleRandomGradient = () => {
    const randomGradient = generateRandomGradient();
    setCurrentGradient(randomGradient);
    setAngle(Math.floor(Math.random() * 360));
  };

  const handleCustomGradient = () => {
    const customGradient = {
      name: "Custom",
      color1: customColor1,
      color2: customColor2,
      angle: angle,
    };
    setCurrentGradient(customGradient);
  };

  const handleAddToDocument = () => {
    const canvas = canvasRef.current;
    if (!canvas || !addOnSdk) return;

    canvas.toBlob((blob) => {
      if (blob) {
        addOnSdk.app.document.addImage(blob);
      }
    }, "image/png");
  };

  const handleEnableDrag = () => {
    const canvas = canvasRef.current;
    if (!canvas || !addOnSdk) return;

    addOnSdk.app.enableDragToDocument(canvas, {
      previewCallback: (element) => {
        // Must return a URL object, not a string
        return new URL(element.toDataURL());
      },
      completionCallback: async (element) => {
        return new Promise((resolve) => {
          element.toBlob((blob) => {
            resolve([{ blob }]);
          }, "image/png");
        });
      },
    });
  };

  useEffect(() => {
    handleEnableDrag();
  }, [currentGradient, angle]);

  return (
    <div className="gradient-generator">
      <div className="header">
        <h2>🌈 Gradient Magic</h2>
        <p>Create stunning gradients for your designs</p>
      </div>

      <div className="gradient-preview">
        <canvas
          ref={canvasRef}
          className="gradient-canvas"
          onClick={handleAddToDocument}
        />
        <div className="gradient-info">
          <span className="gradient-name">{currentGradient.name}</span>
          <span className="click-hint">Click to add • Drag to place</span>
        </div>
      </div>

      <div className="controls">
        <div className="angle-control">
          <label>Angle: {angle}°</label>
          <Slider
            value={angle}
            min={0}
            max={360}
            step={1}
            onChange={(e) =>
              setAngle(Number((e.target as HTMLInputElement).value))
            }
          />
        </div>

        <div className="custom-colors">
          <label>Create Custom:</label>
          <div className="color-inputs">
            <div className="color-input">
              <input
                type="color"
                value={customColor1}
                onChange={(e) => setCustomColor1(e.target.value)}
              />
              <span>Color 1</span>
            </div>
            <div className="color-input">
              <input
                type="color"
                value={customColor2}
                onChange={(e) => setCustomColor2(e.target.value)}
              />
              <span>Color 2</span>
            </div>
            <Button size="s" onClick={handleCustomGradient}>
              Apply
            </Button>
          </div>
        </div>
      </div>

      <div className="actions">
        <Button variant="accent" size="m" onClick={handleRandomGradient}>
          🎲 Random Gradient
        </Button>
        <Button variant="primary" size="m" onClick={handleAddToDocument}>
          ➕ Add to Design
        </Button>
      </div>

      <div className="presets">
        <h3>Trending Gradients</h3>
        <div className="preset-grid">
          {PRESET_GRADIENTS.map((preset, index) => (
            <div
              key={index}
              className={`preset-item ${
                currentGradient.name === preset.name ? "active" : ""
              }`}
              style={{
                background: `linear-gradient(${preset.angle || 45}deg, ${
                  preset.color1
                }, ${preset.color2})`,
              }}
              onClick={() => handlePresetClick(preset)}
            >
              <span className="preset-name">{preset.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
