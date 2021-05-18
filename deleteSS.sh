if [ -d ss ];
then
echo "Sí, sí existe." && rm -r ss
echo "Carpeta borrada"
	mkdir ss
echo "Carpeta creada"
else
echo "No, no existe"
mkdir ss
fi