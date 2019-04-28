import _ from 'underscore';

export default (data) => {
    const errors = {};

    _.forEach(data, (item) => {
        if (!item['LINK PHOTO']) {
            errors.linkPhoto = 'LINK PHOTO required';
        }
        if (!item['MARQUE / BRAND']) {
            errors.marqueBrand = 'Marque / Brand Required'
        }
        if (!item['REFERENCES B&B']) {
            errors.referencesBB = 'REFERENCES B&B Required';
        }
        if (!item['EAN']) {
            errors.ean = 'EAN required';
        }
        if (!item['COULEUR']) {
            errors.couleur = 'Couleur required';
        }
        if (!item['TISSU/MATERIAU']) {
            errors.tissuMateriau = 'TISSU/MATERIAU required';
        }
        if (!item['NOM  MODELE / MODEL NAME']) {
            errors.modelName = 'NOM  MODELE / MODEL NAME required';
        }
        if (!item['TYPE/ CATEGORIE PRODUIT']) {
            errors.type = 'TYPE/ CATEGORIE PRODUIT required';
        }
    });

    return errors;
}
