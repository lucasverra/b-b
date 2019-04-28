import _ from 'underscore';

export default (data) => {
    const errors = {};
    const marque = data[0]['MARQUE / BRAND'];
    const isAllLinkPhotoUnique = Object.keys(_.countBy(data, 'LINK PHOTO')).length === data.length;
    const isAllReferencesBBUnique = Object.keys(_.countBy(data, 'REFERENCES  B&B')).length === data.length;
    const isAllEanUnique = Object.keys(_.countBy(data, 'EAN')).length === data.length;

    // unique records
    if (!isAllEanUnique){
        errors.nonUniqueEan = 'EAN must be unique';
    }
    if (!isAllLinkPhotoUnique){
        errors.nonUniqueLink = 'LINK PHOTO must be unique';
    }
    if (!isAllReferencesBBUnique){
        errors.nonUniqueReferences = 'REFERENCES  B&B must be unique';
    }

    _.forEach(data, (item) => {
        // required
        if (!item['LINK PHOTO']) {
            errors.linkPhoto = 'LINK PHOTO required';
        }
        if (!item['MARQUE / BRAND']) {
            errors.marqueBrand = 'Marque / Brand Required'
        }
        if (!item['REFERENCES  B&B']) {
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
        // other
        if (item['MARQUE / BRAND'] && item['MARQUE / BRAND'] !== marque) {
            errors.brandTheSame = 'Brand must be the same';
        }
    });

    return errors;
}
