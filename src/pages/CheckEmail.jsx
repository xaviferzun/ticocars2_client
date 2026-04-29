
//KAN-62 Page to show it after registration. 
function CheckEmail() {
  return (
    <div className="auth-page">
      <div className="card">
        <h2>Revisa tu correo</h2>
        <p>Te enviamos un enlace de activación. Abre tu correo y haz clic en el botón para activar tu cuenta.</p>
        <a href="/login">Volver al inicio de sesión</a>
      </div>
    </div>
  );
}
export default CheckEmail;