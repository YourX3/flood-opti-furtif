describe("Fonctions de conversion/normalisation", function() {
    it("calcule du nombre de chiffre dans un nombre", function() {
        expect(nombreDeChiffreDansCeNombre(191097375)).toBe(9);
    });

    describe("conversion de nombre", function() {
        it("en tronquant à 3 chiffres significatif", function() {
            expect(tronquerA_N_ChiffresSignificatif(191097375, 3)).toBe(191000000);
        });
        it("en tronquant à 2 chiffres significatif", function() {
            expect(tronquerA_N_ChiffresSignificatif(191097375, 2)).toBe(190000000);
        });
        it("en tronquant à 1 chiffres significatif", function() {
            expect(tronquerA_N_ChiffresSignificatif(191097375, 1)).toBe(100000000);
        });
        it("envoi une exeption à 0 chiffres significatif", function() {
            expect(function(){tronquerA_N_ChiffresSignificatif(191097375, 0)}).toThrow();
        });
    });
    
    describe("Pour normaliser les entrées utilisateur on converti leurs entrées en nombre entier", function() {
        it("en supprimant les espaces", function() {
            expect(supprimeLesEspaces(' 100 000 000')).toBe('100000000');
            expect(supprimeLesEspaces('50 tdc')).toBe('50tdc');
        });
        it("en convertissant les préfixe numérique (k, M, G, T...) en le nombre de 0 adéquoit", function() {
            expect(convertiLesPrefixesNumeriqueEnNombre('10k')).toBe('10000');
            expect(convertiLesPrefixesNumeriqueEnNombre('9M')).toBe('9000000');
            expect(convertiLesPrefixesNumeriqueEnNombre('8G')).toBe('8000000000');
        });
        it("en supprimant tout les caractères non numérique restant", function() {
            expect(str2int('50 tdc')).toBe(50);
            expect(str2int('nombre : 50 tdc')).toBe(50);
        });
        it("en tronquant ce qu'il y a après la virgule", function() {
            expect(str2int('360,9')).toBe(360);
            expect(str2int('1.9')).toBe(1);
        });
    });
    
});

describe("Dans l'applicatif métier on trouve :", function() {
    describe("Une fourmilière", function() {
        it("existe", function() {
            expect(new Fourmiliere()).toBeDefined();
        });
        it("a du terrain de chasse (tdc)", function() {
            var tdc = 100;
            var maFourmiliere = new Fourmiliere(tdc);
            expect(maFourmiliere.tdc).toBe(100);
        });
    });
    
    describe("Un flood unique", function() {
        var leFloodeur;
        var laCible;
        beforeEach(function() {
            leFloodeur = new Fourmiliere(100);
            laCible = new Fourmiliere(100);
        });
        
        it("envoi une exeption si la cible est trop petite pour être atteinte (tdc cible <=50% du tdc floodeur)", function() {
            leFloodeur.tdc = 1000;
            laCible.tdc = 500;
            expect(function(){leFloodeur.calculLeProchainFloodSur(laCible);}).toThrow(new RangeError('tdc de la cible <= 50% de celui du flooder'));
        });
        it("envoi une exeption si la cible est trop grande pour être atteinte (tdc cible >300% du tdc floodeur)", function() {
            laCible.tdc = 301;
            expect(function(){leFloodeur.calculLeProchainFloodSur(laCible);}).toThrow(new RangeError('cible trop grande'));
        });
        it("envoi une exeption si la cible a 50 ou moins de tdc", function() {
            leFloodeur.tdc = 80;
            laCible.tdc = 50;
            expect(function(){leFloodeur.calculLeProchainFloodSur(laCible);}).toThrow(new RangeError('tdc de la cible <= 50'));
        });
    
        it("flood toujours d'un nombre entier", function() {
            laCible.tdc = 99;
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(19);
            leFloodeur.tdc = 1000;
            laCible.tdc = 550;
        });
        it("flood 20% du tdc cible", function() {
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(20);
        });
        it("si la cible se retrouve hors porté après un flood, réduire le flood en conséquence", function() {
            leFloodeur.tdc = 999;
            laCible.tdc = 550;
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(50);
            leFloodeur.tdc = 80;
            laCible.tdc = 55;
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(4);
        });
        it("si la cible est déjà presque hors porté, la flooder de 20%", function() {
            leFloodeur.tdc = 999;
            laCible.tdc = 500;
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(100);
            leFloodeur.tdc = 80;
            laCible.tdc = 51;
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(10);
        });
    });
    describe("Un flood unique anti-traçeur", function() {
        var leFloodeur;
        var laCible;
        beforeEach(function() {
            leFloodeur = new Fourmiliere(486876541, 5);
            laCible = new Fourmiliere(955486876);
        });
        it("arrondi le résultat du flood pour ne pas être repéré", function() {
            leFloodeur.niveauDeDiscretion=5
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(100000000); // précision global 1
            
            leFloodeur.niveauDeDiscretion=4
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(100000000); // précision global 2
            
            leFloodeur.niveauDeDiscretion=3
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(190000000); // précision global 1
            
            leFloodeur.niveauDeDiscretion=2
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(190000000); // précision global 2
            
            leFloodeur.niveauDeDiscretion=1
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(191097375); // précision global 2
            
            leFloodeur.niveauDeDiscretion=0
            expect(leFloodeur.calculLeProchainFloodSur(laCible)).toBe(191097375);
            
        });
    });
});

/*
describe("Dans l'interface", function() {
    describe("Les champs de saisie de la page html normalisent les données fournies par l'utilisateur", function() {
        jasmine.getFixtures().fixturesPath = '.';
        loadFixtures('../index.html');
        it("au cours de la saisie", function() {
            //??expect('keyup').toHaveBeenTriggeredOn("#calculateurDeFlood [required]");
        });
        it("à la sortie du champs", function() {
        });
        it("en convertissant leur contenu en nombre entier", function() {
        });
    });
    describe("L'envoi du formulaire", function() {
        it("s'activent au clic sur les boutons", function() {
        });
        it("lancent les calculs adapté", function() {
        });
        it("déclenchent l'affichage des résultats", function() {
        });
    });
    describe("L'affichage des flood", function() {
        it("affiche les exeptions quand il y en a", function() {
        });
        it("affiche un tableau", function() {
        });
        describe("ce tableau contient", function() {
            it("un ligne de titre", function() {
            });
            it("une ligne par flood à faire", function() {
            });
            it("une ligne pour le total de chaque colonne", function() {
            });
            it("une colonne pour l'évolution du tdc du floodeur", function() {
            });
            it("une colonne pour la quantité de tdc floodé", function() {
            });
            it("une colonne pour l'évolution du tdc de la cible", function() {
            });
        });
    });
    
});
*/