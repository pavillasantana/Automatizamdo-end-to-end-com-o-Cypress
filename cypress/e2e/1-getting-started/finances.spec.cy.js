/// <reference types = 'cypress' />

import{ format, prepareLocalStorage } from'../1-getting-started/support/utils.js';


context('Dev finances', () => {


    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/',{ 
        onBeforeLoad: (win) =>{
        prepareLocalStorage(win)
        }
        })

    });


    it('Cadastrar Entradas', () => {


        cy.visit('https://devfinance-agilizei.netlify.app/#')

        

        cy.get('#transaction .button').click()
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type('12')
        cy.get('[type=date]').type('2023-02-07')
        cy.get('button').contains('Salvar').click();
        cy.get('#data-table tbody tr ').should('have.length', 3)

    });
    it('Cadastrar Saídas', () => {
        cy.visit('https://devfinance-agilizei.netlify.app/#')

        cy.get('#transaction .button').click()
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type('-12')
        cy.get('[type=date]').type('2023-02-08')
        cy.get('button').contains('Salvar').click();
        cy.get('#data-table tbody tr ').should('have.length', 3)
    });

    it('Remover Entradas e Saídas', () => {

        cy.visit('https://devfinance-agilizei.netlify.app/#')

        const entrada = "Mesada"
        const saida   = "KinderOvo"

        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('[name=amount]').type('100')
        cy.get('[type=date]').type('2023-02-08')
        cy.get('button').contains('Salvar').click();
        
        cy.get('#transaction .button').click() 
        cy.get('#description').type(saida)  
        cy.get('[name=amount]').type('-35') 
        cy.get('[type=date]').type('2023-02-08') 
        cy.get('button').contains('Salvar').click(); 

        cy.contains(entrada)
            .parent()
            .find('img[onclick*=remove]')
            .click()

        cy.get('td.description')
        .contains(saida)
        .siblings()
        .children('img[onclick*=remove]')
        .click()
        cy.get('#data-table tbody tr ').should('have.length', 2);
    });

    it('Validar saldo com diversas transações', () => {

        cy.visit('https://devfinance-agilizei.netlify.app/#')

        

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
          .each(($el, index,$list) =>{

            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }
                cy.log(`entradas`, incomes)
                cy.log(`saídas`, expenses)

                })

          }) 
          cy.get('#totalDisplay ').invoke('text').then(text =>{
        
            
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses;
            
            expect(formattedTotalDisplay).to.eq(expectedTotal)
           })
    });
});