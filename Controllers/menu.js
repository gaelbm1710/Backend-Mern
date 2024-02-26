const Menu =  require("../models/menu");

async function createMenu(req,res){
    try{
        const menu = new Menu(req.body);
        const menuStored = await menu.save();
        res.status(200).send({msg: "Menu creado con Exito"});
    }catch (error){
        res.status(400).send({msg:"Error al crear el menu"});
    }
}

async function getMenus(req,res){
    const {active} = req.query;
    let response = null;
    if(active === undefined){
        response = await Menu.find().sort({order: "asc"});
    }else{
        response = await Menu.find({active}).sort({order: "asc"});
    }
     console.log(response);
     if(!response){
        res.status(400).send({msg:"No se ha encontrado ningun Menu"});
     }else{
        res.status(200).send(response);
    }
}

async function updateMenu(req,res){
    const {id} = req.params;
    const menuData = req.body;
    try{
        await Menu.findByIdAndUpdate({_id: id }, menuData);
        res.status(200).send({msg:"Se actualizo de forma correcta"});
    }catch (error){
        res.status(400).send({msg:"Error al actualizar el Menu"});
    }
}

async function deleteMenu(req,res){
    const { id } = req.params;
    try{
        const deleteMenu = await Menu.findByIdAndDelete(id);
        if(deleteMenu){
            res.status(200).send({msg: "Menu eliminado"});
        }else{
            res.status(400).send({msg: "Menu no encontrado"});
        }
    }catch (error){
        res.status(500).send({msg:"Error al eliminar Menu"});
    }
}

module.exports={
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu
}