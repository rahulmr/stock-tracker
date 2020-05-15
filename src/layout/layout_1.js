import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isObject} from 'lodash';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, VideoCameraOutlined } from '@ant-design/icons';

import SubComponent from '../components/subComponent/subComponent.Connect';


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class Layout1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            currentContent: 'SharpReversal',
            menuConf: {
                'SharpReversal': 'Sharp Reversal',
                'VolumeShockers': 'Volume Shockers',
                'PricerChangers': 'Huge Price Changers'
                // '3': {
                //     'title': 'Price Based',
                //     'icon': 'dashboard',
                //     'subItems': {'4': 'Low To High', '5': 'High to Low'}
                // }
            }
        };
        bindAll(this, ['onCollapse', 'setCurrentContent', 'createMenuItems']);
    }

    onCollapse(collapsed) {
        this.setState({collapsed});
    }

    setCurrentContent(itemKey) {
        this.setState({currentContent: itemKey});
    }

    createMenuItems(itemsList) {
        const items = Object.keys(itemsList).map((itemKey) => {
            const item = itemsList[itemKey];
            if(!isObject(item)) {
                return (<Menu.Item key={itemKey} onClick={(item) => this.setCurrentContent(item.key)}>{item}</Menu.Item>)
            } else {
                return (<SubMenu key={itemKey} icon={<Icon type={item.icon} />} title={item.title}>
                    {this.createMenuItems(item.subItems)}
                </SubMenu>);
            }
        });
        return items;
    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">Dashboard</Menu.Item>
                        <Menu.Item key="3">About App</Menu.Item>
                    </Menu>
                </Header>
                <Content className="layout-main-content">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className="site-layout-background">
                        {/* <Sider className="site-layout-background" width={200}> */}
                        <Sider
                            collapsible
                            inlineCollapsed={this.state.collapsed} 
                            onCollapse={this.onCollapse}
                            className="site-layout-background" width={200}
                            breakpoint="lg"
                            collapsedWidth="0">
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={[this.state.currentContent]}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}>
                                {this.createMenuItems(this.state.menuConf)}
                            </Menu>
                        </Sider>
                        <Content className="layout-sub-content">
                            <SubComponent {...this.props} screenType={this.state.currentContent} />
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Stock Tracker - ©2020 Created by Amol Naval</Footer>
            </Layout>
        );
    }
}

Layout1.propTypes = {};

Layout1.defaultProps = {};

export default Layout1;
