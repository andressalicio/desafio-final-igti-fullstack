const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

const create = async (req, res) => {
  const description = req.body.description;
  const value = req.body.value;
  const category = req.body.category;
  const year = req.body.year;
  const month = req.body.month;
  const day = req.body.day;
  const yearMonth =  req.body.yearMonth;
  const yearMonthDay = req.body.yearMonthDay;
  const type = req.body.type;

  try {
    let transaction = new TransactionModel();
    transaction.description = description;
    transaction.value = value;
    transaction.category = category;
    transaction.year = year;
    transaction.month = month;
    transaction.day = day;
    transaction.yearMonth = yearMonth;
    transaction.yearMonthDay = yearMonthDay;
    transaction.type = type;

    transaction.save();
    res.send(transaction);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
  }
};

const findAll = async (req, res) => {
  const yearMonth = req.params.yearMonth;

  //condicao para o filtro no findAll
  var condition = { yearMonth: { $regex: new RegExp(yearMonth), $options: 'i' }};

  try {
    const transaction = await TransactionModel.find(condition);
    res.send(transaction);
    
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'É necessário informar o periodo em yyyy-mm' });
    
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  console.log('findone');

  try {
    const transaction = await TransactionModel.findById(id);
    console.log(transaction);
    res.send(transaction);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o transaction id: ' + id });
    
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;
  const description = req.body.description;
  const value = req.body.value;
  const category = req.body.category;
  const year = req.body.year;
  const month = req.body.month;
  const day = req.body.day;
  const yearMonth =  req.body.yearMonth;
  const yearMonthDay = req.body.yearMonthDay;
  const type = req.body.type;

  try {
    let transaction = await TransactionModel.findById(id);
    transaction.description = description;
    transaction.value = value;
    transaction.category = category;
    transaction.year = year;
    transaction.month = month;
    transaction.day = day;
    transaction.yearMonth = yearMonth;
    transaction.yearMonthDay = yearMonthDay;
    transaction.type = type;

    transaction.save();

    res.send({ message: 'Transaction atualizado com sucesso' });

   
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a transaction id: ' + id });
    
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await TransactionModel.findOneAndDelete({_id: id});
    res.send({ message: 'transaction excluido com sucesso' });
    
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o transaction id: ' + id });
    
  }
};


module.exports = { create, findAll, findOne, update, remove };
