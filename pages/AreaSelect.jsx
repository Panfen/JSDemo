import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import './index.scss';

export default () => {

	const [visible, setVisible] = useState(false);
	const [endPoint, setEndPoint] = useState([0, 0]);
	const [activeIndex, setActiveIndex] = useState([]);
	const data = new Array(64).fill('');

	let startPoint;

	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				document.getElementById('wrap')?.addEventListener('mousedown', handleStart);
		    document.getElementById('wrap')?.addEventListener('mousemove', handleMove);
		    document.getElementById('wrap')?.addEventListener('mouseup', handleStop);
			}, 500);
	  }
    return () => {
      document.getElementById('wrap')?.removeEventListener('mousedown', handleStart);
      document.getElementById('wrap')?.removeEventListener('mousemove', handleMove);
      document.getElementById('wrap')?.removeEventListener('mouseup', handleStop);
    };
  }, [visible]);

  const handleStart = (e) => {
  	e.preventDefault();
  	startPoint = e;
  	calcArea(e, e);
  }

  const handleMove = (e) => {
  	e.preventDefault();
  	if (startPoint) {
  		calcArea(startPoint, e);
  	}
  }

  const calcArea = (start, end) => {
  	let newActiveIndex = []
		let x1 = calcTarget(start.offsetX, 80);
		let x2 = calcTarget(end.offsetX, 80);
		let y1 = calcTarget(start.offsetY, 40);
		let y2 = calcTarget(end.offsetY, 40);

		// 处理特殊情况，选了空区域
		// if (x1 === x2 && !isInBlank(x1, 80) || y1 === y2 && !isInBlank(y1, 40) ) {
		// 	return
		// }

		for(let i = y1 - 1; i < y2; i++) {
			for (let j = x1 - 1; j < x2; j++) {
				newActiveIndex.push(i * 8 + j);
			}
		}
		setActiveIndex([...newActiveIndex]);
  }

  /**
   * 获取目标块序号
   */ 
  const calcTarget = (offset, len) => {
  	let target;
  	// 假设最大范围8 * 8
  	for (let i = 1; i <= 8; i++) {
  		// 焦点在块上、焦点在空隙
  		if (((len + 5) * i - len <= offset && offset <= (len + 5) * i) || ((len + 5) * (i - 1) < offset && offset < (len + 5) * i - len)) {
  			target = i;
  		}
  	}
  	return target;
  }

  /**
   * 判断是否处于空隙
   */
  const isInBlank = (value, len) => {
  	let isIn = false;
  	for (let i = 0; i < 8; i++) {
  		if ((len + 5) * i < value && value < (len + 5) * i + 5) {
  			isIn = true;
  		}
  	}
  	return isIn;
  }

  const handleStop = (e) => {
  	e.preventDefault();
  	startPoint = null;
  }

	return (
		<div className="select-modal">
		<a onClick={() => setVisible(true)}>点击</a>
			<Modal
				visible={visible}
				closeable={true}
				onCancel={() => setVisible(false)}
				width={750}
			>
				<div id="box">
					{data.map((item, index) => <div className={`item ${activeIndex.includes(index) ? 'active': ''}`}>D{index}</div>)}
					<div id="wrap"></div>
				</div>
			</Modal>
		</div>
	)
}
