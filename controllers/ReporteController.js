const excel = require('node-excel-export');
const { User, Establecimiento,Experiencia, Experiencia_Usada,Sequelize } = require('../db');


const getAdminEstablecimiento = async(id) => {
  User.belongsTo(Establecimiento, { foreignKey: 'establecimiento_nit_user' })
  return User.findOne({
      where: { id_user: id },
      include: {
          model: Establecimiento
      }
  })
}

module.exports={
    async clientesEstablecimiento(req,res){


      let admin = req.headers.id_user;
        let nit;
      
        let clientes;
        await getAdminEstablecimiento(admin)
        .then((user)=>{
            nit=user.establecimiento_nit_user;
        })



      User.hasMany(Experiencia_Usada,{foreignKey:'user_id_user_usada'})
        Experiencia_Usada.belongsTo(Experiencia,{foreignKey:'experiencia_id_experiencia_usada'})

        await User.findAll({raw: true,attributes: ['nombre_usuario','numero_celular','email'],group: ['nombre_usuario','numero_celular','email'],include: [{
            model: Experiencia_Usada,
              include: {
                model: Experiencia,
                where:{
                    establecimiento_nit:nit
                },
                attributes: []
              },
              required: true,
              attributes: []
              
        }
    
    ]})
        .then((usuarios)=>{
            clientes=usuarios;
        })

        const styles = {
            headerDark: {
              fill: {
                fgColor: {
                  rgb: 'FF000000'
                }
              },
              font: {
                color: {
                  rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
              }
            },
            cellPink: {
              fill: {
                fgColor: {
                  rgb: 'FFFFCCFF'
                }
              }
            },
            cellGreen: {
              fill: {
                fgColor: {
                  rgb: 'FF00FF00'
                }
              }
            }
          };
           
          //Array of objects representing heading rows (very top)
          const heading = [
            [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
            ['a2', 'b2', 'c2'] // <-- It can be only values
          ];
           
          //Here you specify the export structure
          const specification = {
            nombre_usuario: { // <- the key should match the actual data key
              displayName: 'Nombre', // <- Here you specify the column header
              headerStyle: styles.headerDark, // <- Header style
              width: 220 // <- width in pixels
            },
            numero_celular: {
              displayName: 'Teléfono',
              headerStyle: styles.headerDark,
              width: '10' // <- width in chars (when the number is passed as string)
            },
            email: {
              displayName: 'Correo',
              headerStyle: styles.headerDark,
              width: 220 // <- width in pixels
            }
          }
           
          // The data set should have the following shape (Array of Objects)
          // The order of the keys is irrelevant, it is also irrelevant if the
          // dataset contains more fields as the report is build based on the
          // specification provided above. But you should have all the fields
          // that are listed in the report specification
          const dataset = clientes
           
          // Define an array of merges. 1-1 = A:1
          // The merges are independent of the data.
          // A merge will overwrite all data _not_ in the top-left cell.
          const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
            { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
          ]
           
          // Create the excel report.
          // This function will return Buffer
          const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
              {
                name: 'UsuariosEstablecimiento', // <- Specify sheet name (optional)
                
                
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
              }
            ]
          );
           
          // You can then return this straight
          res.attachment('reporte_usuarios_establecimiento.xlsx'); // This is sails.js specific (in general you need to set headers)
          return res.send(report);
    }
}