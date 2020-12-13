import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
} from 'react-bootstrap';
import ASCII_JSON from 'data/load-data.json';
import ProductCard from 'components/ProductCard';
import './style.css';
import { FaSortAmountDown , FaSortAmountUpAlt } from 'react-icons/fa';
import moment from 'moment';
import PulseLoader from "react-spinners/PulseLoader";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort_value: 'id',
            sort: 'asc',
            products: [],
            loaded_products: [],
            page: 1,
            page_limit: 20,
            loading: false,
        }
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.sortProducts = this.sortProducts.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    sortProducts = (sort, val) => {
        let sorted_items = [];
        if (sort === 'asc') {
            sorted_items = ASCII_JSON.sort(function (a, b) {
                return a[val] - b[val];
            });
        } else {
            sorted_items = ASCII_JSON.sort(function (a, b) {
                return b[val] - a[val];
            });
        }
        this.setState({
            loading: true,
            products: [],
            loaded_products: [],
            page: 1,
        }, () => {
            setTimeout(() => {
                this.setState({
                    sort: sort,
                    sort_value: val,
                    products: sorted_items,
                    loaded_products: JSON.parse(JSON.stringify(sorted_items)).splice(0,20),
                    loading: false,
                })
            }, 3000);
        });
    }

    handleChangeValue = (e) => {
        console.log(e.target.value);
        this.sortProducts(this.state.sort, e.target.value);
    }

    handleSort = () => {
        if ( this.state.sort === 'asc') {
            this.sortProducts('desc', this.state.sort_value);
        } else {
            this.sortProducts('asc', this.state.sort_value);
        }
    }

    handleScroll = (e) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            const all_products = this.state.products;
            const total_loaded = this.state.page * this.state.page_limit;
            if (all_products.length > total_loaded) {
                this.loadNewProducts(all_products, total_loaded);
            }
        }
    }

    loadNewProducts = (all_products, total_loaded) => {
        const remaining_items = all_products.length - total_loaded;
        const to_be_loaded = remaining_items % 20;
        const new_page = this.state.page + 1;
        let new_list = [];
        if (!to_be_loaded) {
            const item_count = new_page * this.state.page_limit;
            new_list = JSON.parse(JSON.stringify(all_products)).splice(0, item_count);
        } else {
            new_list = JSON.parse(JSON.stringify(all_products));
        }
        this.setState({
            loading: true,
        }, () => {
            setTimeout(() =>{
                this.setState({
                    loaded_products: new_list,
                    page: new_page,
                    loading: false
                })
            }, 3000)
        });
    }

    getProductDate = (item) => {
        var a = moment(item.date,'YYYY-MM-D');
        var b = moment(new Date());
        var diffDays = b.diff(a, 'days');
        let product_date = '';
        if (diffDays > 7 || diffDays < 1) {
            product_date = item.date;
        } else {
            product_date = diffDays + (diffDays > 1 ? ' days' : ' day') + ' ago';
        }
        return product_date;
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll, false);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        //load data from json
        this.setState({
            loading: true,
        }, () => {
            setTimeout(() =>{
                const product_list = ASCII_JSON;
                const first_data = JSON.parse(JSON.stringify(ASCII_JSON)).splice(0, 20);
                this.setState({
                    products: product_list,
                    loaded_products: first_data,
                    loading: false,
                })
            }, 5000)
        })
    }
    
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll, false);
    }

    render() {
        return (
            <Container fluid className='body-content'>
                <div className='sort-container'>
                    <Row>
                        <Col>
                            <Form inline>
                                <Form.Group controlId="sort_by">
                                    <Form.Label>Sort By: &nbsp;&nbsp;&nbsp;</Form.Label>
                                    <Form.Control as="select" name='value' onChange={this.handleChangeValue}>
                                        <option value='id'>ID</option>
                                        <option value='price'>Price</option>
                                        <option value='size'>Size</option>
                                    </Form.Control>
                                    { this.state.sort === 'asc' ?
                                        <FaSortAmountDown
                                            style={{marginLeft: '10px', fontSize: '20px'}}
                                            color='#6c757d'
                                            onClick={this.handleSort}
                                        />:<FaSortAmountUpAlt
                                            style={{marginLeft: '10px', fontSize: '20px'}}
                                            color='#6c757d'
                                            onClick={this.handleSort}
                                        />

                                    }
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </div>
                <div className='main-container'>
                    <Row>
                        { this.state.loaded_products.map((item, index) => {
                            
                            return (
                                <Col xs={4}>
                                    <ProductCard
                                        data={item.data}
                                        size={item.size}
                                        price={item.price}
                                        id={item.id}
                                        date={this.getProductDate(item)}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                </div>
                <div className='loader'>
                    <PulseLoader
                        css={{
                            display: 'block',
                            borderColor: 'red',
                        }}
                        size={25}
                        color={"#8384888c"}
                        margin={10}
                        loading={this.state.loading}
                    />
                </div>
                { this.state.loaded_products.length === this.state.products.length &&
                    this.state.loading === false ?
                    (<div>
                        <Row>
                            <Col><div className='end-list'>~ End of Catalogue ~</div></Col>
                        </Row>
                    </div>) : null
                }
            </Container>
        );
    }
};

export default Home;
