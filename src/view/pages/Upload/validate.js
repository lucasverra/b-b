import _ from 'underscore';

export default (data) => {
    const errors = {};
    const finalData = [];
    const marque = data[0]['MARQUE / BRAND'];
    const isAllLinkPhotoUnique = Object.keys(_.countBy(data, 'LINK PHOTO')).length === data.length;
    const isAllReferencesBBUnique = Object.keys(_.countBy(data, 'REFERENCES  B&B')).length === data.length;
    const isAllEanUnique = Object.keys(_.countBy(data, 'EAN')).length === data.length;

    // unique records
    if (!isAllEanUnique){
        errors.nonUniqueEan = 'La colonne EAN a des éléments égaux';
    }
    if (!isAllLinkPhotoUnique){
        errors.nonUniqueLink = 'La colonne LINK PHOTO a des éléments égaux';
    }
    if (!isAllReferencesBBUnique){
        errors.nonUniqueReferences = 'La colonne REFERENCES  B&B a des éléments égaux';
    }

    _.forEach(data, (item) => {
        // required
        if (!item['LINK PHOTO']) {
            errors.linkPhoto = 'La colonne LINK PHOTO n’est pas complète.';
        }
        if (!item['MARQUE / BRAND']) {
            errors.marqueBrand = 'La colonne Marque / Brand n’est pas complète.'
        }
        if (!item['REFERENCES  B&B']) {
            errors.referencesBB = 'La colonne REFERENCES B&B n’est pas complète.';
        }
        if (!item['EAN']) {
            errors.ean = 'La colonne EAN n’est pas complète.';
        }
        if (!item['COULEUR']) {
            errors.couleur = 'La colonne Couleur n’est pas complète.';
        }
        if (!item['TISSU/MATERIAU']) {
            errors.tissuMateriau = 'La colonne TISSU/MATERIAU n’est pas complète.';
        }
        if (!item['NOM  MODELE / MODEL NAME']) {
            errors.modelName = 'La colonne NOM  MODELE / MODEL NAME n’est pas complète.';
        }
        if (!item['OOS / NEW']) {
            errors.type = 'In Column `OOS/NEW` every record should have value.';
        } else if (item['OOS / NEW'].toUpperCase().replace(' ', '') !== 'OOS') {
            // check if item is not in oos and add it into finalData
            finalData.push(item)
        }
         if (!item['TYPE/ CATEGORIE PRODUIT']) {
            errors.type = 'La colonne TYPE/ CATEGORIE PRODUIT n’est pas complète.';
        }
        // other
        if (item['MARQUE / BRAND'] && item['MARQUE / BRAND'] !== marque) {
            errors.brandTheSame = 'La colonne MARQUE / BRAND possède plus d’une valeur.e';
        }
    });

    return {
        errors: Object.keys(errors).length > 0 ? errors : null,
        finalData,
    };
}
