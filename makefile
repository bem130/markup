compilecpp:
	g++ main.cpp -o main -O2
runexe:
	./main.exe

dev_nmlts: nml.ts
	npx tsc nml.ts --removeComments