export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          style={{
            fontSize: readOnly ? 14 : 20,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#f5a623' : '#ddd',
            transition: 'color 0.1s',
          }}
        >★</span>
      ))}
    </div>
  )
}
