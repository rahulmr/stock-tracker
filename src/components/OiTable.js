import React from 'react';
import {Table, Modal, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty} from 'lodash';
import Item from 'antd/lib/list/Item';

class OITable extends React.Component {

    constructor(props) {
        super(props);
        bindAll(this, ['handleOk']);
        this.count = 0;
        this.timer = null;
        this.state = {
            exchange: 'nse',
            showModal: false,
            stockitem: {}
        };
    }

    handleOk() {
        this.setState({showModal: false});
    }

   
    render() {
        let {sectionData = [], param, sectionTitle= '', info = '', columns} = this.props;
        const {stockitem = {}} = this.state;
        if(isEmpty(sectionData)) {
            return null;
        }
        sectionData = sectionData.map((item) => {
            return {...item, 
                ['Increase(%)']: item['Increase(%)'].replace('%', ''),
                showBgHighlight: parseInt(item['Increase(%)'].replace('%', ''), 10) > 40,
                ['Chg(Rs)Chg (%)']: item['Chg(Rs)Chg (%)'].split('  ')[1].replace('%', '')
            };
        });


        const defaultcolumns = [
            {
                title: 'Company Name',
                dataIndex: 'Symbol',
                key: 'Symbol',
                sorter: (a, b) => a.Symbol.localeCompare(b.Symbol),
                sortDirections: ['ascend', 'descend']
            },
            {
                title: 'OI Increase Percent',
                dataIndex: 'Increase(%)',
                key: 'Increase(%)',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a['Increase(%)'] - b['Increase(%)']
            },
            {
                title: 'Change Percentage',
                dataIndex: 'Chg(Rs)Chg (%)',
                key: 'Chg(Rs)Chg (%)',
                sorter: (a, b) => a['Chg(Rs)Chg (%)'] - b['Chg(Rs)Chg (%)']
            },
            {
                title: 'Last Price',
                dataIndex: 'Last Price',
                key: 'Last Price',
                sorter: (a, b) => a['Last Price'] - b['Last Price']
            }
        ];

        return(<div className="sections">
            <div className="section-header">
                <h3>{sectionTitle}<span className="stock-signify">{info}</span></h3>
            </div>
            <div className="section-body">
                <Table
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (e) => this.onRowClick(record)
                        };
                    }}
                    dataSource={sectionData}
                    rowClassName={(record) => record.showBgHighlight ? 'highlight-row': ''}
                    columns={columns || defaultcolumns}
                    pagination={sectionData.length > 10}/>
                <Modal
                    className="field-properties-modal"
                    title= {'Stock Details'}
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleOk}
                    footer={[
                        <Button key="primary-button" className="primary-button" type="primary" onClick={this.handleOk}>
                            Ok
                        </Button>
                    ]}
                    destroyOnClose={true}>
                </Modal>
            </div>
        </div>);

    }
}

OITable.propTypes = {};

OITable.defaultProps = {};

export default OITable;
