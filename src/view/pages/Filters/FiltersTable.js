import React, { useState } from 'react';
import { Table, Input, Icon } from 'antd';
import _ from 'underscore';

const dataIndexes = ['NO.', 'REFERENCES  B&B', 'NOM  MODELE / MODEL NAME', 'TYPE/ CATEGORIE PRODUIT', 'COULEUR', 'COULEUR PIEDS'];
const titles = ['#', 'CODE B&B', 'NOM', 'CATEGORIE', 'COULEUR', 'PIEDS'];
const sorter = (a, b) => a > b ? -1 : 1;
const filter = (val, record, col) => record[col] === val;

const handleSearch = (confirm, val, setSelectedKeys) => {
    setSelectedKeys([val]);
    confirm();
};

const FiltersTable = ({ dataSource }) => {
    const [searchVal, setSearchVal] = useState('');
    const filtersUniqueVals = {};
    _.forEach(dataIndexes.slice(1), (col, i) => {
        filtersUniqueVals[col] = _.countBy(dataSource, col);
    });

    const columns = [
        {
            dataIndex: dataIndexes[0],
            title: titles[0],
            width: '5%',
        },
        {
            dataIndex: dataIndexes[1],
            title: titles[1],
            sorter,
            width: '20%',
            filterDropdown: ({confirm, setSelectedKeys}) => (
                <Input.Search
                    onChange={(e) => setSearchVal(e.target.value)}
                    onSearch={() => handleSearch(confirm, searchVal, setSelectedKeys)}
                />
            ),
            filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record[dataIndexes[1]].toUpperCase().includes(value.toUpperCase()),
        },
        {
            dataIndex: dataIndexes[2],
            title: titles[2],
            sorter,
            width: '20%',
            filters: _.map(Object.keys(filtersUniqueVals[dataIndexes[2]]), (key) => ({ value: key, text: key })),
            onFilter: (val, record) => filter(val, record, dataIndexes[2]),
        },
        {
            dataIndex: dataIndexes[3],
            title: titles[3],
            sorter,
            width: '35%',
            filters: _.map(Object.keys(filtersUniqueVals[dataIndexes[3]]), (key) => ({ value: key, text: key })),
            onFilter: (val, record) => filter(val, record, dataIndexes[3]),
        },
        {
            dataIndex: dataIndexes[4],
            title: titles[4],
            sorter,
            width: '10%',
            filters: _.map(Object.keys(filtersUniqueVals[dataIndexes[4]]), (key) => ({ value: key, text: key })),
            onFilter: (val, record) => filter(val, record, dataIndexes[4]),
        },
        {
            dataIndex: dataIndexes[5],
            title: titles[5],
            sorter,
            width: '10%',
            filters: _.map(Object.keys(filtersUniqueVals[dataIndexes[5]]), (key) => ({ value: key, text: key })),
            onFilter: (val, record) => filter(val, record, dataIndexes[5]),
        },
    ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
                showSizeChanger: true
            }}
        />
    )
};

export default FiltersTable
