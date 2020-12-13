import React from 'react';
import './style.css';
import {Row, Col } from 'react-bootstrap';

const PoductCard = ({
	data,
	size,
	price,
	id,
	date,
}) => {
  return (
	<div className='card-container' key={id}>
		<Row>
			<Col>
				<div className='product-item' style={{fontSize: size + 'px'}}>{data}</div>
			</Col>
		</Row>
		<Row>
			<Col>
				<div className='product-description'>
					<div>{'Price : ' + price.toLocaleString('en-US', {style: 'currency',currency: 'USD'})}</div>
					<div>{'Size : ' + size}</div>
					<div>{'Date : ' + date}</div>
				</div>
			</Col>
		</Row>
    </div>
  );
};

export default PoductCard;
