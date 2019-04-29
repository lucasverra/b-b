import {createSelector} from 'reselect'
import _ from 'underscore';

const data = ({file}) => file.data;
const colName = 'NOM  MODELE / MODEL NAME';

export default createSelector(
    data,
    data => {
        if (data) {
            const modelsWithCounts = _.countBy(data, colName);
            const modelsWithData = {};

            _.forEach(Object.keys(modelsWithCounts), item => {
                modelsWithData[item] = [];
            });

            _.forEach(data, item => {
                modelsWithData[item[colName]].push(item);
            });

            return modelsWithData;
        } else {
            return null;
        }
    },
);
