import { CircularProgress, styled } from "@mui/material";
import { FC, MutableRefObject, useEffect } from "react";
import "./style.scss";

export interface LivePlayerProps {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  loading: boolean;
}

const Loading = styled(CircularProgress)({
  position: "absolute",
  left: "calc(50% - 20px)",
  top: "calc(50% - 20px)",
});

function addWaterMarker(
  str: string,
  ref: MutableRefObject<HTMLVideoElement | null>
) {
  let cpyName = str;
  if (str.length > 16) {
    cpyName = str.substring(0, 16);
  }
  const can = document.createElement("canvas") as HTMLCanvasElement;
  const video = ref.current as HTMLVideoElement;
  video.appendChild(can);
  can.width = 180;
  can.height = 110;
  can.style.display = "none";
  can.style.zIndex = "999";
  const ctx = can.getContext("2d");
  ctx?.rotate((-25 * Math.PI) / 180);
  if (ctx) {
    ctx.font = "800 30px Microsoft JhengHei";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (ctx.measureText(cpyName).width > 180) {
      const size = 180 / cpyName.length;
      ctx.font = "800 " + size + "px " + " Microsoft JhengHei";
    }
    ctx.fillText(cpyName, 60, 100);
  }
  video.style.backgroundImage = "url(" + can.toDataURL("image/png") + ")";
}

// 配置类型定义
type imgOptions = {
  // 宽度
  width: number;
  // 高度
  height: number;
  // 水印内容
  content: string;
  // 水印字体
  font: string;
  // 水印颜色
  color: string;
  // 偏转角度（deg）
  rotateDegree: number;
  // X轴偏移量
  x: number;
  // Y轴偏移量
  y: number;
};

function createImgBase(options: imgOptions): string {
  const canvas = document.createElement("canvas");
  const text = options.content;
  // 因为要实现文字交错效果，所以这里生成两倍宽度的图片
  canvas.width = options.width * 2;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // X轴阴影距离，负值表示往上，正值表示往下
    ctx.shadowOffsetX = 2;
    // Y轴阴影距离，负值表示往左，正值表示往右
    ctx.shadowOffsetY = 2;
    // 阴影的模糊程度
    ctx.shadowBlur = 2;
    ctx.font = options.font;
    ctx.fillStyle = options.color;
    ctx.rotate(options.rotateDegree);
    ctx.textAlign = "left";
    ctx.fillText(text, options.x, options.y);
  }
  return canvas.toDataURL("image/png");
}

// 配置类型
type watermarkOptions = {
  // 自定义类名
  className?: string;
  // 宽度
  width?: number;
  // 高度
  height?: number;
  // 文案内容
  content?: string;
  // 字体
  font?: string;
  // 颜色
  color?: string;
  // 偏转角度
  rotate?: number;
  // 定位方式
  position?: string;
  // 顶部距离
  top?: number;
  // 左侧距离
  left?: number;
  // 层级
  zIndex?: number;
};

/**
 * 生成水印
 * @param {String} className 水印类名
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @param {String} content 内容
 * @param {String} font 字体
 * @param {String} color 自定义样式: 如字体颜色(使用RGBA)
 * @param {Number} rotate 翻转角度
 * @param {String} position 水印定位方式
 * @param {Number} top 距离顶部位置
 * @param {Number} left 距离左部位置
 * @param {Number} zIndex 水印层级
 */
function genWaterMark({
  className = "watermarked",
  width = 60,
  height = 40,
  content = "水印",
  font = "14px PingFang SC, sans-serif",
  color = "#fff",
  rotate = -14,
  position = "absolute",
  top = 0,
  left = 0,
  zIndex = 1000,
}: watermarkOptions): void {
  const option = {
    width,
    height,
    content,
    font,
    color,
    rotateDegree: (rotate * Math.PI) / 180,
  };

  // 为了实现交错水印的效果，此处生成两张位置不同的水印 固定相对位置
  const dataUri1 = createImgBase({
    ...option,
    x: 10,
    y: 24,
  });
  const dataUri2 = createImgBase({
    ...option,
    x: 50,
    y: 54,
  });

  let defaultStyle = document.createElement("style");
  defaultStyle.innerHTML = `.${className}:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    ${top || top === 0 ? `top: ${top}px;` : ""}
    ${left || left === 0 ? `left: ${left}px;` : ""}
    background-repeat: repeat;
    pointer-events: none;
  }`;

  let styleEl = document.createElement("style");
  styleEl.innerHTML = `.${className}:after
  {
    ${position ? `position: ${position}` : ""};
    ${zIndex ? `z-index:${zIndex}` : ""};
    background-image: url(${dataUri1}), url(${dataUri2});
    background-size: ${option.width * 2}px ${option.height}px;
  }`;
  document.head.appendChild(defaultStyle);
  document.head.appendChild(styleEl);
}

const option = {
  content: "测试水印",
  className: "watermarked",
};

export const LivePlayer: FC<LivePlayerProps> = ({ videoRef, loading }) => {
  useEffect(() => {
    // if (videoRef) {
    //   addWaterMarker("water", videoRef);
    // }
    genWaterMark(option);
  }, [videoRef]);
  return (
    <div className="live-player-container watermarked">
      {loading && <Loading />}
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};
