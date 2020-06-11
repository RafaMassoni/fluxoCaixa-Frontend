import React, { useEffect, useState } from 'react';
import Header from './Header';
import api from './Api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Switch from '@material-ui/core/Switch';
import {Dialog,DialogActions,TextField,DialogContentText,DialogContent,DialogTitle, MenuItem} from '@material-ui/core';

function Lista(){

    const [ operacaoSistema , setOperacaoSistema ] = useState([]);
    const [ open , setOpen ] = useState(false);

     const [ openUpdate , setOpenUpdate ] = useState(false);

  
    const [ operacao , setOperacao ] = useState();
    const [ categoria , setCategoria ] = useState('');
    const [ valor , setValor ] = useState('');
    const [ data , setData ] = useState('');
    const [ ativo , setAtivo ] = useState();

    const [ id , setId] = useState();

    function loadData()
    {
        api.get('/caixa').then(response =>  {

            const operacaoSistema = response.data;
            setOperacaoSistema(operacaoSistema);

        });
        
    }

    useEffect(loadData, []);

    function openDialog()
    {
        setOpen(true);
    }

    function closeDialog()
    {
        setOpen(false);
    }

     function openDialogUpdate(operacao,categoria,valor,data,ativo,id)
    {
        setOperacao(operacao);
        setCategoria(categoria);
        setValor(valor);
        setData((data.substr(0 , 10)));
        setAtivo(ativo);
        setId(id);


        setOpenUpdate(true);
    }

    function closeDialogUpdate()
    {
        setOpenUpdate(false);
    }

     async function salvar() { 

        console.log("a", operacao,categoria,valor,data,ativo);  

          await api.post('/caixa', {operacao, categoria, valor, data, ativo}); 
        loadData();
        closeDialog();

        setOperacao('');
        setCategoria('');
        setValor('');
        setData('');
        setAtivo();
    }

    async function salvarUpdate() { 

        console.log("a", operacao,categoria,valor,data,ativo,id);  

        await api.put(`/caixa/${id}`, {id, operacao, categoria, valor, data, ativo});
          
        loadData();
        closeDialogUpdate();

        setOperacao('');
        setCategoria('');
        setValor('');
        setData('');
        setAtivo();
        setId();
    }


     async function apagar(id) { 


        await api.delete(`/caixa/id/${id}`);
        loadData();
    }

    async function atualizar(id, Ativo) { 

      

       switch(Ativo)
       {
       case 1:
           Ativo = 0;
            break
        default:
           Ativo = 1;
            break
       }

        await api.put(`/caixa/id/${id}`, {ativo: Ativo });

        loadData();
    }
  

    return <div style={{marginTop: '70px'}}>
        <Header/>
        <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="center">Operação</TableCell>
            <TableCell align="center">Categoria</TableCell>
            <TableCell align="center">Valor</TableCell>
            <TableCell align="center">Data</TableCell>
            <TableCell align="center">Efetuado</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operacaoSistema.map(item => (
            <TableRow key={item.id}>
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell align="center">{item.operacao === '+' ? 'Receber' : 'Pagar' }</TableCell>
              <TableCell align="center">{item.categoria}</TableCell>
              <TableCell align="center">R$ {item.valor}</TableCell>
              <TableCell align="center">{item.data.substr(0 , 10)}</TableCell>
              <TableCell align="center"> <Switch checked={item.ativo === 1 ? true : false } color="primary" onChange={() => atualizar(item.id, item.ativo)} />  </TableCell>
              <TableCell align="center" style={{width: '15px'}}>  <Button variant="outlined" color="primary" onClick={() => openDialogUpdate(item.operacao,item.categoria,item.valor,item.data,item.ativo,item.id)}>  <CreateIcon /> &nbsp;Editar </Button> </TableCell>
              <TableCell align="center" style={{width: '15px'}}>  <Button variant="outlined" color="secondary" onClick={() => apagar(item.id)}> <DeleteIcon /> &nbsp;Apagar </Button> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button  style={{marginTop: '20px'}}
        onClick={openDialog}
        variant="contained" 
        color="primary">
            Adicionar
    </Button>

    <Dialog open ={open}>
         <DialogTitle>Nova Operação</DialogTitle>
            <DialogContent>
                <DialogContentText>Preencha os dados para cadastrar uma nova Operação.</DialogContentText>
                 <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Tipo de operação"
                    fullWidth
                    onChange={e => setOperacao(e.target.value)} >

                         <MenuItem value='+'>
                            Receber
                        </MenuItem>
                         <MenuItem value='-'>
                            Pagar
                        </MenuItem>
                       

                </TextField>
                <TextField
                    margin="dense"
                    id="categoria"
                    label="Categoria"
                    type="text"
                    fullWidth
                    onChange={e => setCategoria(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="valor"
                    label="Valor"
                    type="text"
                    fullWidth
                    onChange={e => setValor(e.target.value)}
                />
                 <TextField
                    margin="dense"
                    id="data"
                    label="Data"
                    type="date"
                    defaultValue="2020-01-01"
                    fullWidth
                    onChange={e => setData(e.target.value)}
                />
                <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Tipo de operação"
                    fullWidth
                    onChange={e => setAtivo(e.target.value)} >

                         <MenuItem value='0'>
                            Não efetuado
                        </MenuItem>
                         <MenuItem value='1'>
                            Efetuado
                        </MenuItem>
                       

                </TextField>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancelar</Button>
                <Button onClick={salvar}>Salvar</Button>
            </DialogActions>
    </Dialog>

    <Dialog open ={openUpdate}>
         <DialogTitle>Nova Operação</DialogTitle>
            <DialogContent>
                <DialogContentText>Preencha os dados para cadastrar uma nova Operação.</DialogContentText>
                 <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Tipo de operação"
                    value={operacao}
                    fullWidth
                    onChange={e => setOperacao(e.target.value)} >

                         <MenuItem value='+'>
                            Receber
                        </MenuItem>
                         <MenuItem value='-'>
                            Pagar
                        </MenuItem>
                       

                </TextField>
                <TextField
                    margin="dense"
                    id="categoria"
                    label="Categoria"
                    type="text"
                    value={categoria}
                    fullWidth
                    onChange={e => setCategoria(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="valor"
                    label="Valor"
                    type="text"
                    value={valor}
                    fullWidth
                    onChange={e => setValor(e.target.value)}
                />
                 <TextField
                    margin="dense"
                    id="data"
                    label="Data"
                    type="date"
                    value={data}
                    fullWidth
                    onChange={e => setData(e.target.value)}
                />
                <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Tipo de operação"
                    value={ativo}
                    fullWidth
                    onChange={e => setAtivo(e.target.value)} >

                         <MenuItem value='0'>
                            Não efetuado
                        </MenuItem>
                         <MenuItem value='1'>
                            Efetuado
                        </MenuItem>
                       

                </TextField>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialogUpdate}>Cancelar</Button>
                <Button onClick={salvarUpdate}>Salvar</Button>
            </DialogActions>
    </Dialog>
    
        </div>
    
}


export default Lista