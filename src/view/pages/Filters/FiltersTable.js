import React from 'react';
import { Table } from 'antd'

const columns = [
    {
        dataIndex: 'NO.',
        title: '#',
        width: '5%',
    },
    {
        dataIndex: 'REFERENCES  B&B',
        title: 'CODE B&B',
        sorter: (a, b) => a > b ? -1 : 1,
        width: '20%',
    },
    {
        dataIndex: 'NOM  MODELE / MODEL NAME',
        title: 'NOM',
        sorter: (a, b) => a > b ? -1 : 1,
        width: '20%',
    },
    {
        dataIndex: 'TYPE/ CATEGORIE PRODUIT',
        title: 'CATEGORIE',
        sorter: (a, b) => a > b ? -1 : 1,
        width: '35%',
    },
    {
        dataIndex: 'COULEUR',
        title: 'COULEUR',
        sorter: (a, b) => a > b ? -1 : 1,
        width: '10%',
    },
    {
        dataIndex: 'COULEUR PIEDS',
        title: 'PIEDS',
        sorter: (a, b) => a > b ? -1 : 1,
        width: '10%',
    },
];

const FiltersTable = ({ dataSource }) => (
    <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
            showSizeChanger: true
        }}
    />
);

export default FiltersTable
