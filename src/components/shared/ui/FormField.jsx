import { inputStyle, labelStyle } from './styles';

// Wraps labelStyle+inputStyle for the common label-above-input case used
// throughout Login/Register/Checkout/SellerDashboard forms.
export default function FormField({ label, as = 'input', style, children, ...rest }) {
  const Tag = as;
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      {as === 'select' ? (
        <select style={{ ...inputStyle, ...style }} {...rest}>{children}</select>
      ) : (
        <Tag style={{ ...inputStyle, ...style }} {...rest} />
      )}
    </div>
  );
}
