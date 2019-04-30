import React from 'react';
import { Table } from 'antd'

const columns = [
    {
        dataIndex: 'NO.',
        title: '#',
    },
    {
        dataIndex: 'REFERENCES  B&B',
        title: 'CODE B&B',
    },
    {
        dataIndex: 'NOM  MODELE / MODEL NAME',
        title: 'NOM',
    },
    {
        dataIndex: 'TYPE/ CATEGORIE PRODUIT',
        title: 'CATEGORIE',
    },
    {
        dataIndex: 'COULEUR',
        title: 'COULEUR',
    },
    {
        dataIndex: 'COULEUR PIEDS',
        title: 'PIEDS',
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
