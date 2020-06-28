import React from 'react';
import {Form, Button, Switch as AntSwitch, Table, Select, InputNumber, Icon} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';
import {QUERY_ATTRIBUTES, STOCK_ATTRIBUTES} from '../../../consts/index';

import StocksTable from '../../StocksTable';
const Option = Select.Option;

// Attribute Operator Value  AND/OR
// Attribute logicalOperator Attribute MathOperator Value

const ArithOperators = ['>', '>=', '<', '<=', '==', '!=='];
const LogicalOperators = ['&&', '||'];

class QueryBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: null,
            defaultAtt: {
                attribute: '',
                mathOperator: '',
                value: '',
                logicalOperator: '',
                attribute2: ''
            },
            columns: null,
            selectedColumns: [],
            sectionalBlocks: [[]]
        };
        bindAll(this, ['excecuteInInterval', 'endBlock', 'onAttributeChange', 'renderLogicalBlocks',
            'selectColumns', 'deleteRow', 'createTable']);
    }

    componentDidMount() {
        this.excecuteInInterval();
        this.timer = setInterval(() => {
            this.excecuteInInterval();
        }, API_INTERVAL);
    }

    createTable() {
        const {queryBuilderStocks = {}} = this.props;
        const {sectionalBlocks = []} = this.state;
        const {mostActiveByValueAllStocks = [], itemKeys = []} = queryBuilderStocks;
        const {searchresult = []} = mostActiveByValueAllStocks;
        const columns = this.state.selectedColumns.map((item) => {
            const [dataIndex, type, displayName] = item.split('_');
            return {
                title: displayName,
                dataIndex: dataIndex,
                key: dataIndex,
                sorter: type === 'number' ? (a, b) => a[dataIndex] - b[dataIndex] : (a, b) => a[dataIndex].localeCompare(b[dataIndex])
            };
        });

        const dataSource = searchresult.filter((item) => {
            let sectionalExp = '(';
            sectionalBlocks.forEach((block, blockIndex) => {
                let logicalExp = '(';
                let finalOp = '';
                block.forEach((expression, index) => {
                    if(index !== block.length-1) {
                        logicalExp += `item['${expression.attribute}'] ${expression.mathOperator} ${parseFloat(expression.value || item[expression.attribute2].current, 10)} ${expression.logicalOperator} `;
                    } else {
                        logicalExp += `item['${expression.attribute}'] ${expression.mathOperator} ${parseFloat(expression.value || item[expression.attribute2].current, 10)})`;
                        finalOp = ` ${expression.logicalOperator}`;
                    }
                });
                if(blockIndex !== sectionalBlocks.length-1) {
                    logicalExp += `${finalOp} `;
                }
                if(block.length === 0) {
                    logicalExp = '';
                }
                sectionalExp += logicalExp;
            });
            sectionalExp = isEmpty(sectionalExp) ? '' : (sectionalExp+')');
            try {
                if(sectionalExp.length < 4 || eval(sectionalExp)) {
                    return item;
                }
            } catch(e) {
                console.error(e);
            }
        });

        this.setState({columns, searchresult: dataSource});
    }
    
    selectColumns(selectedColumns) {
        this.setState({selectedColumns});
    }

    deleteRow(index, sectionalIndex) {
        let logicalBlock = this.state.sectionalBlocks.find((item, index1) => index1 === sectionalIndex);
        let logicalBlockData = logicalBlock.filter((item, mapInd) => {
            if(mapInd !== index) {
                return item;
            }
        });
        let updatedSectionalBlock = this.state.sectionalBlocks.map((item, index2) => {
            if(index2 === sectionalIndex) {
                return logicalBlockData;
            }
            return item;
        });
        updatedSectionalBlock = updatedSectionalBlock.filter((item) => !isEmpty(item));
        this.setState({sectionalBlocks: updatedSectionalBlock});
    }

    onAttributeChange(val, index, attr, sectionalIndex) {
        let logicalBlock = this.state.sectionalBlocks.find((item, index1) => index1 === sectionalIndex);
        let logicalBlockData = logicalBlock.map((item, mapInd) => {
            if(mapInd == index) {
                return {...item, [attr]: val};
            }
            return item;
        });
        if(attr === 'logicalOperator') {
            logicalBlockData = [...logicalBlockData, this.state.defaultAtt];
        }
        let updatedSectionalBlock = this.state.sectionalBlocks.map((item, index2) => {
            if(index2 === sectionalIndex) {
                return logicalBlockData;
            }
            return item;
        });
        this.setState({sectionalBlocks: updatedSectionalBlock});
    }

    endBlock() {
        const sectionalBlocks = [...this.state.sectionalBlocks, [[this.state.defaultAtt]]];
        this.setState({sectionalBlocks: sectionalBlocks});
    }

    excecuteInInterval() {
        const {commonProps} = this.props;
        const {exchange = 'nse', minprice, maxprice, marketCap} = commonProps;
        this.props.mostActiveByValue({exchange, minprice, maxprice, marketCap});
    }

    renderSectionOnObject(sectionTitle, sectionData, info = '') {
        sectionData = Object.keys(sectionData).map((item) => sectionData[item]);
        return (<StocksTable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info} />);
    }

    renderSectionOnArray(sectionTitle, sectionData, info = '', param) {
        return (<StocksTable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info}
            param={param} />);
    }

    renderLogicalBlocks(logicalBlocks, sectionalIndex) {

        if(!logicalBlocks || logicalBlocks.length == 0) {
            return null;
        }
        let blockItems = [];
        blockItems = logicalBlocks.map((item, index) => (<div key={index} className="logical-block">
            <Select
                showSearch
                className="query-select-attribute"
                value={item.attribute}
                placeholder="Select an attribute"
                optionFilterProp="key"
                onChange={(e) => this.onAttributeChange(e, index, 'attribute', sectionalIndex)}
                filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {QUERY_ATTRIBUTES && QUERY_ATTRIBUTES.map((item) => <Option key={item} value={item}>{item}</Option>)}
            </Select>
            <Select
                showSearch
                value={item.mathOperator}
                className="query-select-mathop"
                placeholder="Select an operator"
                optionFilterProp="children"
                onChange={(e) => this.onAttributeChange(e, index, 'mathOperator', sectionalIndex)}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {ArithOperators && ArithOperators.map((item) => <Option key={item} value={item}>{item}</Option>)}
            </Select>
            <Select
                showSearch
                className="query-select-attribute"
                value={item.attribute2}
                placeholder="Select an attribute"
                optionFilterProp="key"
                onChange={(e) => this.onAttributeChange(e, index, 'attribute2', sectionalIndex)}
                filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {QUERY_ATTRIBUTES && QUERY_ATTRIBUTES.map((item) => <Option key={item} value={item}>{item}</Option>)}
            </Select> OR
            <InputNumber value={item.value} min={0} max={10000000} defaultValue={0} onChange={(e) => this.onAttributeChange(e, index, 'value', sectionalIndex)} />
            <Select
                showSearch
                className="query-select-logicalOp"
                value={item.logicalOperator}
                placeholder="Select logical operator"
                onChange={(e) => this.onAttributeChange(e, index, 'logicalOperator', sectionalIndex)}>
                {LogicalOperators && LogicalOperators.map((item) => <Option key={item} value={item}>{item}</Option>)}
            </Select>
            <Button className="ant-btn ant-btn-primary ant-btn-circle delete-btn" onClick={(e) => this.deleteRow(index, sectionalIndex)}><Icon type="delete"/></Button>
        </div>));

        return blockItems;
    }

    render() {

        const {queryBuilderStocks = {}} = this.props;
        const {sectionalBlocks=[]} = this.state;
        const {itemKeys = []} = queryBuilderStocks;
  

        return (
            <div className="stock-data">
                <div>
                    <div className="query-build">
                        <h3>Build Query: </h3>
                        {sectionalBlocks && sectionalBlocks.map((item, index) => {
                            return (<div key={`sectional_block_${index}`} className="sectional-block">
                                {this.renderLogicalBlocks(item, index)}
                            </div>);
                        })}

                        {/* {this.renderLogicalBlocks(logicalBlocks)} */}

                        <Button className="ant-btn ant-btn-primary" onClick={this.endBlock}>NEW GROUP</Button>

                        <div className="select-columns">
                            <h3>Select Columns: </h3>
                            <Select
                                mode="multiple"
                                className="query-column-select"
                                placeholder="Select Column for the table"
                                defaultValue={this.state.selectedColumns}
                                onChange={this.selectColumns}
                            >
                                {STOCK_ATTRIBUTES && STOCK_ATTRIBUTES.map((item) => <Option key={item.key} value={`${item.key}_${item.type}_${item.displayName}`}>{item.displayName}</Option>)}
                            </Select>
                        </div>

                        <Button className="ant-btn ant-btn-primary" onClick={this.createTable}>APPLY COLUMNS</Button>
                    </div>
                    <div className="query-result">
                        {this.state.columns && <StocksTable
                            columns={this.state.columns}
                            sectionTitle={'Custom Table'}
                            sectionData={this.state.searchresult} />}
                    </div>

                    {/* {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand')}
                    {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, '', 'buyToSellRatio')}       */}
                    {/* Sudden change in volume percentage(300) & price -- Most active by volume API  --- Call this api every 5 mins */}
                    {/* Change in bestBuyQty - Indicates sudden change in open interest */}
                </div>
            </div>
        );
    }
}

QueryBuilder.propTypes = {
    mostActiveByValue:PropTypes.func,
    volumeShockers: PropTypes.object,
    exchange: PropTypes.string
};

QueryBuilder.defaultProps = {
    mostActiveByValue:() => {},
    volumeShockers: {},
    exchange: 'nse'
};

export default QueryBuilder;
