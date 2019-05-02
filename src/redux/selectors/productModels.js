import {createSelector} from 'reselect'
import _ from 'underscore';

const data = (file) => file.data;
const colName = 'NOM  MODELE / MODEL NAME';
const filters = {
    COULEUR: {
        title: 'Couleur',
        data: [],
        selected: [],
    },
    'TYPE/ CATEGORIE PRODUIT': {
        title: 'Categorie',
        data: [],
        selected: [],
    },
    'TISSU/MATERIAU': {
        title: 'Toucher',
        data: [],
        selected: [],
    },
    'COULEUR PIEDS': {
        title: 'Couleur Pieds',
        data: [],
        selected: [],
    },
};

export default createSelector(
    data,
    data => {
        if (data) {
            const modelsWithCounts = _.countBy(data, colName);
            const modelsWithData = {};

            // generate empty object for data structure
            _.forEach(Object.keys(modelsWithCounts), item => {
                modelsWithData[item] = {
                    data: [],
                    filters: {...filters},
                };
            });

            // pass data into models
            _.forEach(data, item => {
                modelsWithData[item[colName]].data.push(item);
            });

            // generate filters data
            _.forEach(Object.keys(modelsWithData), (modelKey) => {
               _.forEach(Object.keys(modelsWithData[modelKey].filters), (filterKey) => {
                   const uniqueFilters = Object.keys(_.countBy(modelsWithData[modelKey].data, filterKey));
                   modelsWithData[modelKey] = {
                       ...modelsWithData[modelKey],
                       filters: {
                           ...modelsWithData[modelKey].filters,
                           [filterKey]: {
                               data: uniqueFilters,
                               selected: uniqueFilters,
                           }
                       }
                   };
               });
            });

            console.log(modelsWithData);

            return {
                modelsWithData,
                modelsWithCounts,
            };
        } else {
            return null;
        }
    },
);
