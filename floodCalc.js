
function Fourmiliere(tdc,niveauDeDiscretion) {
    this.tdc = tdc;
    this.niveauDeDiscretion = niveauDeDiscretion;
    this.calculLeProchainFloodSur = function (fourmiliereCible){
        
        this.verifieSiLaCibleEstAtteignable(fourmiliereCible);
        
        var tdcAFlooder = this.calculLeProchainFloodSommaireSur(fourmiliereCible);
        tdcAFlooder = this.optimiseLesFloodProcheDuSeuilDePortee(fourmiliereCible, tdcAFlooder);
        tdcAFlooder = this.arrondiLeFloodSelonLeNiveauDeDiscretion(tdcAFlooder);
        return tdcAFlooder;
    }
    this.calculLeProchainFloodSommaireSur = function (fourmiliereCible){
        return Math.floor(fourmiliereCible.tdc * 0.2);
    }
    this.verifieSiLaCibleEstAtteignable = function (fourmiliereCible){
        if(fourmiliereCible.tdc <= 0.5 * this.tdc) throw RangeError('tdc de la cible <= 50% de celui du flooder');
        if(fourmiliereCible.tdc <= 50) throw RangeError('tdc de la cible <= 50');
        if(fourmiliereCible.tdc > 3 * this.tdc) throw RangeError('cible trop grande');
    }
    this.optimiseLesFloodProcheDuSeuilDePortee = function (fourmiliereCible, tdcAFlooder){
        var fourmiliereCibleLimiteHorsPorte = new Fourmiliere(fourmiliereCible.tdc - 1);
        try{
            this.verifieSiLaCibleEstAtteignable(fourmiliereCibleLimiteHorsPorte);
        } catch (exception){
            if(exception.message == 'tdc de la cible <= 50% de celui du flooder' || exception.message == 'tdc de la cible <= 50') return tdcAFlooder;
            else throw exception;
        }
        var fourmiliereCibleApresFlood = new Fourmiliere(fourmiliereCible.tdc - tdcAFlooder);
        try{
            this.verifieSiLaCibleEstAtteignable(fourmiliereCibleApresFlood);
        } catch (exception){
            if(exception.message == 'tdc de la cible <= 50% de celui du flooder') tdcAFlooder = fourmiliereCible.tdc - Math.floor(0.5 * this.tdc + 1);
            else if(exception.message == 'tdc de la cible <= 50') tdcAFlooder = fourmiliereCible.tdc - 51;
            else throw exception;
        }
        return tdcAFlooder;
    }
    this.arrondiLeFloodSelonLeNiveauDeDiscretion = function (tdcAFlooder){
        if (this.niveauDeDiscretion>=4) return tronquerA_N_ChiffresSignificatif(tdcAFlooder, 1);
        if (this.niveauDeDiscretion>=2) return tronquerA_N_ChiffresSignificatif(tdcAFlooder, 2);
        return tdcAFlooder;
    }
}

function tronquerA_N_ChiffresSignificatif(nombreATronquer, chiffreSignificatif){
    if( chiffreSignificatif<=0 || !parseInt(chiffreSignificatif) ) throw new Error('le nombre de chiffres significatifs doit être un entier strictement superieur à 0');
    var diviseur = nombreDeChiffreDansCeNombre(nombreATronquer)-chiffreSignificatif;
    return Math.floor(nombreATronquer/Math.pow(10,diviseur))*Math.pow(10,diviseur);
}
function nombreDeChiffreDansCeNombre(nombre){
    return nombre.toString().length;
}

function supprimeLesEspaces(texte){
    return texte.replace(/ /g,'');
}
function convertiLesPrefixesNumeriqueEnNombre(texte){
    return texte.replace(/k/g,'000').replace(/M/g,'000000').replace(/G/g,'000000000').replace(/T/g,'000000000000')
    .replace(/P/g,'000000000000000').replace(/E/g,'000000000000000000').replace(/Z/g,'000000000000000000000').replace(/Y/g,'000000000000000000000000');
}
function str2int(str){
    str = supprimeLesEspaces(str);
    str = convertiLesPrefixesNumeriqueEnNombre(str);
    return parseInt( str.replace(/[^0-9.,]/g,'') );
}