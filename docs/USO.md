# Guía de Uso de la Plataforma Delphi

Esta guía describe de forma breve cómo utilizar la plataforma para crear y gestionar estudios Delphi.

## 1. Acceso a la plataforma

1. Inicia el servidor de desarrollo siguiendo las instrucciones de [README.md](../README.md).
2. Abre `http://localhost:8080` en tu navegador web.
3. Regístrate o inicia sesión con tu cuenta.

## 2. Gestión de expertos

- Ve a **Gestión de Expertos** en el menú principal.
- Crea nuevos expertos completando el formulario con sus datos.
- Importa expertos desde un archivo CSV si lo deseas.
- Desde la tabla de expertos puedes editar o eliminar registros.

## 3. Creación de estudios

1. Selecciona **Crear Estudio** en el panel de control.
2. Elige el tipo de estudio: tradicional o en tiempo real.
3. Completa la información básica (título y descripción) en español e inglés.
4. Añade los participantes que formarán parte del panel de expertos.
5. Define las rondas de preguntas y guarda el estudio.

## 4. Envío de invitaciones

- En la vista de cada estudio, utiliza la opción **Invitar Expertos** para enviar correos de invitación.
- La plataforma controla la cantidad de correos para evitar spam y mostrar errores si un email no es válido.

## 5. Recolección y análisis de respuestas

- Para estudios tradicionales, se irán habilitando las distintas rondas conforme avanza el proceso.
- En estudios en tiempo real, los expertos pueden responder inmediatamente y ver los resultados actualizados.
- Consulta la sección **Análisis de Consenso** para visualizar gráficos con métricas como coeficiente de variación o índice de estabilidad.

## 6. Administración de roles

- Los usuarios con rol de administrador pueden gestionar permisos desde la sección **Roles**.
- Se recomienda asignar el rol de administrador tras registrarse usando el panel de Supabase.

## 7. Consejos de seguridad

- No compartas tus credenciales de acceso.
- Revisa el archivo [SECURITY.md](../SECURITY.md) para conocer todas las medidas implementadas.

¡Listo! Con estos pasos podrás comenzar a usar la plataforma para tus estudios Delphi.

